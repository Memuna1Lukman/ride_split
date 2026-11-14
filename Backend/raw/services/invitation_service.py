from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models, schemas



def create_invitation(
    ride_id:int,
    current_user:models.User,
    invitation:schemas.RideInvitationCreate,
    db:Session
):
    # does ride exits
    ride =db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Ride not Found")
    if ride.status != models.RideStatus.gathering_passengers:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="This ride is not accepting invitations")

    creator_participants = (
        db.query(models.RideParticipant)
        .filter(
            models.RideParticipant.ride_id == ride_id,
            models.RideParticipant.user_id == current_user.id,
            models.RideParticipant.is_creator.is_(True)
        ).first()
    )

    if not creator_participants:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to invite anybody to this ride"
        )

    if invitation.invitee_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="You cannot invite yourself")

    invitee = db.query(models.User).filter(models.User.id == invitation.invitee_id).first()
    if not invitee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Please Login")
    existing_participants = (
        db.query(models.RideParticipant).filter(
            models.RideParticipant.ride_id == ride_id,
            models.RideParticipant.user_id == invitation.invitee_id
        ).first()
    )
    if existing_participants:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="You are already a particapannts")
    
    # Check if an active invitation already exists
    existing_invite = (
        db.query(models.RideInvitation)
        .filter(
            models.RideInvitation.ride_id == ride_id,
            models.RideInvitation.invitee_id == invitation.invitee_id
        ).first()
    )
    if existing_invite:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User has already been invited to this ride"
        )
    participant_count = (
        db.query(models.RideParticipant)
        .filter(models.RideParticipant.ride_id == ride_id)
        .count()
    )
    if participant_count >= ride.capacity:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="This ride is full")

    new_invitation = models.RideInvitation(
        ride_id=ride_id,
        inviter_id=current_user.id,
        invitee_id=invitation.invitee_id
    )
    try:
        db.add(new_invitation)
        db.commit()
        db.refresh(new_invitation)
        return new_invitation
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Could not create invitation due to a database contrainst") 



def respond_to_invitation(
    invitation_id:int,
    response:schemas.RideInvitationRespond,
    current_user:models.User,
    db:Session
):
    invitation_exist = db.query(models.RideInvitation).filter(
        models.RideInvitation.id == invitation_id
    ).first()
    if not invitation_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Ride not found")
    # confirm the invited person is the current user

    if current_user.id != invitation_exist.invitee_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not allowed")
    if invitation_exist.status != models.InvitationStatus.pending:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Invitation has already been answered")

    ride = invitation_exist.ride
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Ride not found")

    if response.status == models.InvitationStatus.accepted:
        if ride.status != models.RideStatus.gathering_passengers:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="This ride is not accepting passengers")

        participant_count = (
            db.query(models.RideParticipant)
            .filter(models.RideParticipant.ride_id == ride.id)
            .count()
        )
        if participant_count >= ride.capacity:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="This ride is full")

        existing_participant = (
            db.query(models.RideParticipant)
            .filter(
                models.RideParticipant.ride_id == ride.id,
                models.RideParticipant.user_id == current_user.id,
            )
            .first()
        )
        if existing_participant:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="You are already a participant in this ride")

        new_participant = models.RideParticipant(
            ride_id=invitation_exist.ride_id,
            user_id=current_user.id,
            is_creator=False
        )
        db.add(new_participant)
    invitation_exist.status = response.status
    invitation_exist.responded_at = datetime.now(timezone.utc)
    try:
        db.commit()
        db.refresh(invitation_exist)
        return invitation_exist
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not process invitation response"
        )

    
