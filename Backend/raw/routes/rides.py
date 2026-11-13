from fastapi import HTTPException,status,Depends,APIRouter
from sqlalchemy.orm import Session
from .. import models,oauth,schemas
from raw.services import ride_service 
from ..database import get_db
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape

router = APIRouter(
    tags=["Rides"],
    prefix="/rides"
)

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.RideOut
)
def create_rides(ride: schemas.RideCreate,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    ride_service.create_ride(ride, current_user, db)

@router.get("/{id}",response_model=schemas.RideOut)
def get_rides(id:int,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    ride_service.get_ride(current_user,db,id)
      
