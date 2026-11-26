from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, oauth, schemas
from ..database import get_db
from ..services import driver_matching_service


router = APIRouter(tags=["Drivers"], prefix="/drivers")


@router.post("/apply", response_model=schemas.DriverProfileOut)
def apply_as_driver(
    payload: schemas.DriverProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    """Let an existing passenger complete the driver profile once."""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Your account is not active.")
    if current_user.role == models.Role.driver:
        return driver_matching_service.require_driver_profile(current_user, db)

    profile = models.DriverProfile(
        user_id=current_user.id,
        vehicle_type=payload.vehicle_type,
        plate_number=payload.plate_number,
        capacity=payload.capacity,
    )
    current_user.role = models.Role.driver
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/me", response_model=schemas.DriverProfileOut)
def my_driver_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.require_driver_profile(current_user, db)


@router.patch("/me/status", response_model=schemas.DriverProfileOut)
def set_driver_status(
    payload: schemas.DriverStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.update_status(current_user, payload, db)


@router.patch("/me/location", response_model=schemas.DriverProfileOut)
def set_driver_location(
    payload: schemas.DriverLocationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.update_location(current_user, payload, db)


@router.get("/me/offers", response_model=List[schemas.DriverOfferOut])
def my_pending_offers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    driver_matching_service.require_driver_profile(current_user, db)
    stale_ride_ids = driver_matching_service.expire_stale_offers(db)
    db.commit()
    # A timed-out offer must release the ride to the next candidate. Lock each
    # ride before invoking the selector so concurrent pollers cannot race it.
    for ride_id in stale_ride_ids:
        ride = (
            db.query(models.Ride)
            .filter(models.Ride.id == ride_id)
            .with_for_update()
            .first()
        )
        if ride and ride.status in (models.RideStatus.ready_for_matching, models.RideStatus.matching):
            driver_matching_service.offer_next_driver(ride.id, db)
    offers = (
        db.query(models.DriverOffer)
        .filter(
            models.DriverOffer.driver_id == current_user.id,
            models.DriverOffer.status == models.OfferStatus.sent,
        )
        .order_by(models.DriverOffer.sent_at.desc())
        .all()
    )
    return [
        {
            **offer.__dict__,
            "pickup_label": offer.ride.pickup_label,
            "dropoff_label": offer.ride.dropoff_label,
            "capacity": offer.ride.capacity,
            "estimated_fare_pesewas": offer.ride.estimated_fare_pesewas,
            "currency": offer.ride.currency,
        }
        for offer in offers
    ]


@router.post("/offers/{offer_id}/respond", response_model=schemas.DriverOfferOut)
def respond_to_driver_offer(
    offer_id: int,
    payload: schemas.DriverOfferRespond,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.respond_to_offer(offer_id, payload, current_user, db)


@router.post("/rides/{ride_id}/start", response_model=schemas.RideOut)
def start_assigned_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.start_ride(ride_id, current_user, db)


@router.post("/rides/{ride_id}/complete", response_model=schemas.RideOut)
def complete_assigned_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return driver_matching_service.complete_ride(ride_id, current_user, db)
