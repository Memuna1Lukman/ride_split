from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, oauth, schemas
from ..database import get_db
from ..services import driver_matching_service


router = APIRouter(tags=["Drivers"], prefix="/drivers")


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
    driver_matching_service.expire_stale_offers(db)
    db.commit()
    return (
        db.query(models.DriverOffer)
        .filter(
            models.DriverOffer.driver_id == current_user.id,
            models.DriverOffer.status == models.OfferStatus.sent,
        )
        .order_by(models.DriverOffer.sent_at.desc())
        .all()
    )


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
