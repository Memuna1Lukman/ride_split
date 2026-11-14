from typing import List
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException,status,Depends,APIRouter
from sqlalchemy.orm import Session
from .. import models,oauth,schemas
from ..services import ride_service,invitation_service
from ..database import get_db
from sqlalchemy import or_


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
    return ride_service.create_ride(ride, current_user, db)

@router.get("/{id}",response_model=schemas.RideOut)
def get_rides(id:int,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    return ride_service.get_ride(current_user,db,id)

@router.get("/",response_model=List[schemas.RideOut])
def get_all_rides(db:Session=Depends(get_db),current_user:models.User = Depends(oauth.get_current_user)):
    rides = (
        db.query(models.Ride).outerjoin(
            models.RideParticipant,
            models.RideParticipant.ride_id == models.Ride.id
        ).filter(or_(
            models.Ride.creator_id == current_user.id,
            models.RideParticipant.user_id == current_user.id
        )).distinct().all()
    )
    return rides


@router.post(
    "/{ride_id}/invitations",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.RideInvitationOut,
)
def create_invitation(
    ride_id: int,
    invitation: schemas.RideInvitationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user)
):
    return invitation_service.create_invitation(
        ride_id=ride_id,
        invitation=invitation,
        current_user=current_user,
        db=db
    )

@router.patch(
      "/invitations/{invitation_id}",
      response_model=schemas.RideInvitationOut,
)
def respond_to_invitation(
    invitation_id: int,
    response: schemas.RideInvitationRespond,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return invitation_service.respond_to_invitation(
        invitation_id=invitation_id,
        response=response,
        current_user=current_user,
        db=db,
    )



    