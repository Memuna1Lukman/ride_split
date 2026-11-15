from typing import List
from fastapi import HTTPException,status,Depends,APIRouter,Response
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


@router.get("/invitation/me",response_model=List[schemas.RideInvitationOut])
def my_invitation(
    db:Session=Depends(get_db),
    current_user:models.User=Depends(oauth.get_current_user)
):
    rides = db.query(models.RideInvitation).filter(
        models.RideInvitation.invitee_id == current_user.id
    ).all()

    return rides


@router.patch("/{ride_id}/cancel",response_model=schemas.RideOut)
def cancel_ride(
    ride_id:int,
    db:Session = Depends(get_db),
    current_user:models.User=Depends(oauth.get_current_user)
):
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    if ride.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the ride creator can cancel this ride")
    if ride.status != models.RideStatus.gathering_passengers:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This ride can no longer be cancelled")

    ride.status = models.RideStatus.cancelled
    db.commit()
    db.refresh(ride)
    return ride


@router.delete("/{ride_id}/participant/me",status_code=status.HTTP_204_NO_CONTENT)
def delete_my_particapation(
    ride_id:int,
    db:Session=Depends(get_db),
    current_user:models.User=Depends(oauth.get_current_user)
):
    # This endpoint lets a non-creator leave a ride.
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    # see whether the person is a participant of that ride
    participant = db.query(models.RideParticipant).filter(
        models.RideParticipant.ride_id == ride_id,
        models.RideParticipant.user_id == current_user.id
    ).first()
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this ride"
        )

    if participant.is_creator:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The ride creator cannot leave; cancel the ride instead",
        )

    db.delete(participant)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{ride_id}/participants",response_model=List[schemas.RideParticipantOut])
def get_all_participants(
    ride_id:int,
    db:Session = Depends(get_db),
    current_user:models.User=Depends(oauth.get_current_user)
):
    # This endpoint allows the creator to see all ride participants.
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    is_creator = db.query(models.RideParticipant).filter(
        models.RideParticipant.ride_id == ride_id,
        models.RideParticipant.user_id == current_user.id,
        models.RideParticipant.is_creator.is_(True),
    ).first()
    if not is_creator:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Not authorized to view all participants")

    return db.query(models.RideParticipant).filter(
        models.RideParticipant.ride_id == ride_id
    ).all()
