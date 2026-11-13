from fastapi import HTTPException, status
from geoalchemy2.elements import WKTElement
from sqlalchemy.orm import Session

from .. import models, schemas


def create_ride(
    ride: schemas.RideCreate,
    current_user: models.User,
    db: Session,
):
    """Create a ride and add its creator as the first participant."""
    if not current_user.is_active or current_user.role != models.Role.passenger:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only active passengers can create rides.",
        )

    # PostGIS POINT values use x=longitude followed by y=latitude.
    pickup_point = WKTElement(
        f"POINT({ride.pickup_location.longitude} {ride.pickup_location.latitude})",
        srid=4326,
    )
    dropoff_point = WKTElement(
        f"POINT({ride.dropoff_location.longitude} {ride.dropoff_location.latitude})",
        srid=4326,
    )

    try:
        driver_ride_capacity = ride.capacity >=1
        new_ride = models.Ride(
            creator_id=current_user.id,
            pickup_location=pickup_point,
            dropoff_location=dropoff_point,
            capacity=driver_ride_capacity,
            estimated_fare_pesewas=ride.estimated_fare_pesewas,
            currency=ride.currency,
            idempotency_key=ride.idempotency_key,
            status=models.RideStatus.gathering_passengers,
        )
        db.add(new_ride)
        db.flush()  # Obtain the ride ID before inserting its participant row.

        db.add(
            models.RideParticipant(
                ride_id=new_ride.id,
                user_id=current_user.id,
                is_creator=True,
            )
        )
        db.commit()
        db.refresh(new_ride)
        return new_ride
    except Exception:
        # Keep ride creation atomic: never persist a ride without its creator.
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="there has been a conflict")
    


def get_ride(
    current_user: models.User,
    db: Session,
    ride_id: int,
):
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    is_participant = any(
        participant.user_id == current_user.id
        for participant in ride.participants
    )

    if not is_participant and ride.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this ride.",
        )

    return ride
