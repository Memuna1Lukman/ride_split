
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .. import models, schemas, utils, oauth
from ..database import get_db


router = APIRouter(
    tags=["Users"],
    prefix="/users"
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserOut
)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    # 1. Validate driver information before touching the database
    if user.role == models.Role.driver:
        if (
            not user.vehicle_type
            or not user.plate_number
            or user.capacity is None
            or user.capacity <= 0
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Drivers must provide a vehicle type, plate number and a positive vehicle capacity."
            )

    # 2. Prepare user data
    user_dict = user.model_dump(
        exclude={
            "password",
            "vehicle_type",
            "plate_number",
            "capacity"
        }
    )

    user_dict["password_hash"] = utils.get_password_hash(user.password)

    new_user = models.User(**user_dict)

    try:
        # 3. Save the user first
        db.add(new_user)
        db.flush()

        # 4. Create a driver profile when necessary
        if user.role == models.Role.driver:
            new_driver_profile = models.DriverProfile(
                user_id=new_user.id,
                vehicle_type=user.vehicle_type,
                plate_number=user.plate_number,
                capacity=user.capacity
            )

            db.add(new_driver_profile)

        # 5. Commit both records together
        db.commit()
        db.refresh(new_user)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with these details already exists."
        )

    return new_user


@router.get(
    "/me",
    response_model=schemas.UserOut
)
def get_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user)
):
    return current_user
