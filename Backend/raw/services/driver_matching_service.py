"""Driver availability, location, and sequential ride-matching rules."""

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_Distance, ST_DWithin
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import models, schemas


MATCH_RADIUS_METERS = 5_000
OFFER_TIMEOUT_SECONDS = 30
LOCATION_MAX_AGE = timedelta(minutes=5)


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def require_driver_profile(current_user: models.User, db: Session, *, lock=False):
    if not current_user.is_active or current_user.role != models.Role.driver:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only active drivers can perform this action.")

    query = db.query(models.DriverProfile).filter(models.DriverProfile.user_id == current_user.id)
    if lock:
        query = query.with_for_update()
    profile = query.first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found.")
    return profile


def update_status(current_user: models.User, payload: schemas.DriverStatusUpdate, db: Session):
    profile = require_driver_profile(current_user, db, lock=True)

    active_ride = db.query(models.Ride.id).filter(
        models.Ride.driver_id == current_user.id,
        models.Ride.status.in_((models.RideStatus.driver_assigned, models.RideStatus.in_progress)),
    ).first()

    if payload.status == models.DriverStatus.available and profile.current_location is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Send your current location before going online.")

    if active_ride and payload.status in (models.DriverStatus.available, models.DriverStatus.offline):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You cannot change availability while assigned to an active ride.")

    # BUSY is owned by offer acceptance and completion, not manually set by a driver.
    if payload.status == models.DriverStatus.busy:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Driver busy status is set automatically when accepting a ride.")

    profile.status = payload.status
    db.commit()
    db.refresh(profile)
    return profile


def update_location(current_user: models.User, payload: schemas.DriverLocationUpdate, db: Session):
    profile = require_driver_profile(current_user, db, lock=True)
    received_at = utcnow()
    recorded_at = payload.recorded_at
    if recorded_at and recorded_at.tzinfo is None:
        recorded_at = recorded_at.replace(tzinfo=timezone.utc)
    if recorded_at and recorded_at > received_at:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Location timestamp cannot be in the future.")

    location = WKTElement(f"POINT({payload.longitude} {payload.latitude})", srid=4326)
    profile.current_location = location
    profile.location_updated_at = recorded_at or received_at
    db.add(models.DriverLocation(driver_id=current_user.id, location=location))
    db.commit()
    db.refresh(profile)
    return profile


def expire_stale_offers(db: Session, ride_id: int | None = None):
    cutoff = utcnow() - timedelta(seconds=OFFER_TIMEOUT_SECONDS)
    query = db.query(models.DriverOffer).filter(
        models.DriverOffer.status == models.OfferStatus.sent,
        models.DriverOffer.sent_at < cutoff,
    )
    if ride_id is not None:
        query = query.filter(models.DriverOffer.ride_id == ride_id)
    stale_ride_ids = [ride_id for (ride_id,) in query.with_entities(models.DriverOffer.ride_id).distinct().all()]
    query.update(
        {models.DriverOffer.status: models.OfferStatus.expired, models.DriverOffer.responded_at: utcnow()},
        synchronize_session=False,
    )
    return stale_ride_ids


def find_nearby_available_drivers(db: Session, pickup_location, excluded_driver_ids: list[int]):
    """Return fresh, available drivers within the radius, nearest first."""
    query = db.query(
        models.DriverProfile,
        ST_Distance(models.DriverProfile.current_location, pickup_location).label("distance_meters"),
    ).filter(
        models.DriverProfile.status == models.DriverStatus.available,
        models.DriverProfile.current_location.isnot(None),
        models.DriverProfile.location_updated_at >= utcnow() - LOCATION_MAX_AGE,
        ST_DWithin(models.DriverProfile.current_location, pickup_location, MATCH_RADIUS_METERS),
    )
    if excluded_driver_ids:
        query = query.filter(models.DriverProfile.user_id.notin_(excluded_driver_ids))
    return query.order_by("distance_meters").all()


def offer_next_driver(ride_id: int, db: Session):
    """Offer a ride to one eligible driver. A later call retries the next driver."""
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).with_for_update().first()
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found.")
    if ride.status not in (models.RideStatus.ready_for_matching, models.RideStatus.matching):
        return None

    expire_stale_offers(db, ride.id)
    live_offer = db.query(models.DriverOffer).filter(
        models.DriverOffer.ride_id == ride.id,
        models.DriverOffer.status == models.OfferStatus.sent,
    ).first()
    if live_offer:
        db.commit()
        db.refresh(live_offer)
        return live_offer

    offered_driver_ids = [
        driver_id for (driver_id,) in db.query(models.DriverOffer.driver_id)
        .filter(models.DriverOffer.ride_id == ride.id)
        .all()
    ]
    candidates = find_nearby_available_drivers(db, ride.pickup_location, offered_driver_ids)
    if not candidates:
        ride.status = models.RideStatus.ready_for_matching
        db.commit()
        return None

    driver_profile, _distance_meters = candidates[0]
    offer = models.DriverOffer(ride_id=ride.id, driver_id=driver_profile.user_id, status=models.OfferStatus.sent)
    ride.status = models.RideStatus.matching
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


def begin_matching(ride_id: int, current_user: models.User, db: Session):
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).with_for_update().first()
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found.")
    if ride.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the ride creator can find a driver.")
    if ride.status == models.RideStatus.ready_for_matching:
        return offer_next_driver(ride.id, db)
    if ride.status != models.RideStatus.gathering_passengers:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This ride cannot begin matching in its current state.")

    ride.status = models.RideStatus.ready_for_matching
    db.commit()
    return offer_next_driver(ride.id, db)


def respond_to_offer(offer_id: int, response: schemas.DriverOfferRespond, current_user: models.User, db: Session):
    require_driver_profile(current_user, db)  # validates role before loading an offer
    offer = db.query(models.DriverOffer).filter(models.DriverOffer.id == offer_id).with_for_update().first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found.")
    if offer.driver_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This offer belongs to another driver.")

    expire_stale_offers(db, offer.ride_id)
    db.refresh(offer)
    if offer.status != models.OfferStatus.sent:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This offer is no longer available.")

    ride = db.query(models.Ride).filter(models.Ride.id == offer.ride_id).with_for_update().first()
    if response.status == models.OfferStatus.rejected:
        offer.status = models.OfferStatus.rejected
        offer.responded_at = utcnow()
        db.commit()
        offer_next_driver(ride.id, db)
        return offer

    profile = require_driver_profile(current_user, db, lock=True)
    active_ride = db.query(models.Ride.id).filter(
        models.Ride.driver_id == current_user.id,
        models.Ride.status.in_((models.RideStatus.driver_assigned, models.RideStatus.in_progress)),
    ).first()
    if profile.status != models.DriverStatus.available or active_ride:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You are no longer available for this offer.")
    if ride.status != models.RideStatus.matching:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This ride is no longer accepting offers.")

    try:
        offer.status = models.OfferStatus.accepted
        offer.responded_at = utcnow()
        ride.driver_id = current_user.id
        ride.status = models.RideStatus.driver_assigned
        ride.driver_assigned_at = utcnow()
        profile.status = models.DriverStatus.busy
        db.query(models.DriverOffer).filter(
            models.DriverOffer.ride_id == ride.id,
            models.DriverOffer.id != offer.id,
            models.DriverOffer.status == models.OfferStatus.sent,
        ).update(
            {models.DriverOffer.status: models.OfferStatus.expired, models.DriverOffer.responded_at: utcnow()},
            synchronize_session=False,
        )
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Another ride was assigned to this driver first.")

    db.refresh(offer)
    return offer


def start_ride(ride_id: int, current_user: models.User, db: Session):
    require_driver_profile(current_user, db)
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).with_for_update().first()
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found.")
    if ride.driver_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the assigned driver can start this ride.")
    if ride.status != models.RideStatus.driver_assigned:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This ride cannot be started in its current state.")
    ride.status = models.RideStatus.in_progress
    ride.started_at = utcnow()
    db.commit()
    db.refresh(ride)
    return ride


def complete_ride(ride_id: int, current_user: models.User, db: Session):
    profile = require_driver_profile(current_user, db, lock=True)
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).with_for_update().first()
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found.")
    if ride.driver_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the assigned driver can complete this ride.")
    if ride.status != models.RideStatus.in_progress:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This ride cannot be completed in its current state.")
    ride.status = models.RideStatus.completed
    ride.completed_at = utcnow()
    profile.status = models.DriverStatus.available
    db.commit()
    db.refresh(ride)
    return ride
