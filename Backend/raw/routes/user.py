from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.orm import Session
from .. import models,schemas,utils,oauth
from ..database import get_db
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    tags=["Users"],
    prefix="/user"
)


@router.post("/",status_code=status.HTTP_201_CERATED,response_model=schemas.UserOut)
def create_user(user:schemas.UserCreate,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    user_dict = user.model_dump()
    # i have to know if the user being created is a driver or passenger so that they get the right profile
    user_dict["password_hash"] =  utils.get_password_hash(user.password_hash)
    new_user = models.User(**user_dict)
    try:
        db.add(new_user)
        db.flush()
        if user.role == models.Role.driver:
            db.add(
                models.DriverProfile(
                    user_id=new_user.id,
                    vehicle_type=user.vehicle_type,
                    plate_number=user.plate_number,
                    capacity=user.capacity,
                )
            )
            db.commit()
            db.refresh(new_user)


    except  IntegrityError: 
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User Already has an account"
        )
    return new_user


@router.get("/me",response_model=schemas.UserOut)
def get_me(db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    return current_user
