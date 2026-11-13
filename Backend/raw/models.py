
import enum

from geoalchemy2 import Geography

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    text,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


# ============================================================
# ENUMS
# ============================================================

class Role(str, enum.Enum):
    passenger = "PASSENGER"
    driver = "DRIVER"


class DriverStatus(str, enum.Enum):
    offline = "OFFLINE"
    available = "AVAILABLE"
    busy = "BUSY"


class RideStatus(str, enum.Enum):
    gathering_passengers = "GATHERING_PASSENGERS"
    ready_for_matching = "READY_FOR_MATCHING"
    matching = "MATCHING"
    driver_assigned = "DRIVER_ASSIGNED"
    in_progress = "IN_PROGRESS"
    completed = "COMPLETED"
    cancelled = "CANCELLED"
    expired = "EXPIRED"


class InvitationStatus(str, enum.Enum):
    pending = "PENDING"
    accepted = "ACCEPTED"
    declined = "DECLINED"
    expired = "EXPIRED"


class OfferStatus(str, enum.Enum):
    sent = "SENT"
    accepted = "ACCEPTED"
    rejected = "REJECTED"
    expired = "EXPIRED"


class PaymentStatus(str, enum.Enum):
    pending = "PENDING"
    processing = "PROCESSING"
    succeeded = "SUCCEEDED"
    failed = "FAILED"
    cancelled = "CANCELLED"
    refunded = "REFUNDED"


# Store the actual enum values in PostgreSQL.
def pg_enum(enum_cls, name):
    return Enum(
        enum_cls,
        name=name,
        values_callable=lambda enum_class: [
            member.value for member in enum_class
        ],
    )


# ============================================================
# USER
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(150), nullable=False)

    email = Column(String(255), nullable=False, unique=True, index=True)

    password_hash = Column(String(255), nullable=False)

    phone = Column(String(20), nullable=False, unique=True)

    role = Column(
        pg_enum(Role, "user_role"),
        nullable=False,
        default=Role.passenger,
    )

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    driver_profile = relationship(
        "DriverProfile",
        back_populates="user",
        uselist=False,
    )

    created_rides = relationship(
        "Ride",
        back_populates="creator",
        foreign_keys="Ride.creator_id",
    )

    participations = relationship(
        "RideParticipant",
        back_populates="user",
    )

    sent_invitations = relationship(
        "RideInvitation",
        back_populates="inviter",
        foreign_keys="RideInvitation.inviter_id",
    )

    received_invitations = relationship(
        "RideInvitation",
        back_populates="invitee",
        foreign_keys="RideInvitation.invitee_id",
    )


# ============================================================
# DRIVER PROFILE
# ============================================================

class DriverProfile(Base):
    __tablename__ = "driver_profiles"

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    vehicle_type = Column(String(100), nullable=False)

    plate_number = Column(String(30), nullable=False, unique=True)

    capacity = Column(Integer, nullable=False, default=4)

    status = Column(
        pg_enum(DriverStatus, "driver_status"),
        nullable=False,
        default=DriverStatus.offline,
    )

    current_location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326,
            spatial_index=True,
        ),
        nullable=True,
    )

    location_updated_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    version = Column(Integer, nullable=False, default=0)

    user = relationship(
        "User",
        back_populates="driver_profile",
    )

    __mapper_args__ = {
        "version_id_col": version,
    }

    __table_args__ = (
        CheckConstraint(
            "capacity > 0",
            name="ck_driver_capacity_positive",
        ),

        Index(
            "ix_driver_profiles_available",
            "status",
            postgresql_where=text("status = 'AVAILABLE'"),
        ),
    )


# ============================================================
# RIDE
# ============================================================

class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)

    creator_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Assigned by the platform, not by the passenger.
    driver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    pickup_location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326,
            spatial_index=True,
        ),
        nullable=False,
    )

    dropoff_location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326,
            spatial_index=True,
        ),
        nullable=False,
    )

    capacity = Column(Integer, nullable=False, default=4)

    # All monetary values are stored in pesewas.
    estimated_fare_pesewas = Column(Integer, nullable=True)

    final_fare_pesewas = Column(Integer, nullable=True)

    currency = Column(String(3), nullable=False, default="GHS")

    status = Column(
        pg_enum(RideStatus, "ride_status"),
        nullable=False,
        default=RideStatus.gathering_passengers,
        index=True,
    )

    idempotency_key = Column(String(255), nullable=True)

    requested_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    driver_assigned_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    started_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    version = Column(Integer, nullable=False, default=0)

    creator = relationship(
        "User",
        back_populates="created_rides",
        foreign_keys=[creator_id],
    )

    driver = relationship(
        "User",
        foreign_keys=[driver_id],
    )

    participants = relationship(
        "RideParticipant",
        back_populates="ride",
        cascade="all, delete-orphan",
    )

    invitations = relationship(
        "RideInvitation",
        back_populates="ride",
        cascade="all, delete-orphan",
    )

    driver_offers = relationship(
        "DriverOffer",
        back_populates="ride",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "version_id_col": version,
    }

    __table_args__ = (
        CheckConstraint(
            "capacity > 0",
            name="ck_ride_capacity_positive",
        ),

        CheckConstraint(
            "estimated_fare_pesewas IS NULL OR estimated_fare_pesewas >= 0",
            name="ck_ride_estimated_fare_non_negative",
        ),

        CheckConstraint(
            "final_fare_pesewas IS NULL OR final_fare_pesewas >= 0",
            name="ck_ride_final_fare_non_negative",
        ),

        UniqueConstraint(
            "creator_id",
            "idempotency_key",
            name="uq_ride_creator_idempotency",
        ),

        # One active job per driver.
        Index(
            "ix_one_active_ride_per_driver",
            "driver_id",
            unique=True,
            postgresql_where=text(
                "driver_id IS NOT NULL AND status IN "
                "('DRIVER_ASSIGNED', 'IN_PROGRESS')"
            ),
        ),
    )


# ============================================================
# RIDE PARTICIPANTS
# ============================================================

class RideParticipant(Base):
    __tablename__ = "ride_participants"

    id = Column(Integer, primary_key=True)

    ride_id = Column(
        Integer,
        ForeignKey("rides.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # The creator is also stored as a participant.
    is_creator = Column(Boolean, nullable=False, default=False)

    joined_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Set when the final fare is calculated.
    fare_share_pesewas = Column(Integer, nullable=True)

    ride = relationship(
        "Ride",
        back_populates="participants",
    )

    user = relationship(
        "User",
        back_populates="participations",
    )

    payments = relationship(
        "Payment",
        back_populates="participant",
    )

    __table_args__ = (
        UniqueConstraint(
            "ride_id",
            "user_id",
            name="uq_ride_participant",
        ),

        CheckConstraint(
            "fare_share_pesewas IS NULL OR fare_share_pesewas >= 0",
            name="ck_participant_fare_non_negative",
        ),
    )


# ============================================================
# RIDE INVITATIONS
# ============================================================

class RideInvitation(Base):
    __tablename__ = "ride_invitations"

    id = Column(Integer, primary_key=True)

    ride_id = Column(
        Integer,
        ForeignKey("rides.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    inviter_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    invitee_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    status = Column(
        pg_enum(InvitationStatus, "invitation_status"),
        nullable=False,
        default=InvitationStatus.pending,
    )

    invited_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    responded_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    ride = relationship(
        "Ride",
        back_populates="invitations",
    )

    inviter = relationship(
        "User",
        back_populates="sent_invitations",
        foreign_keys=[inviter_id],
    )

    invitee = relationship(
        "User",
        back_populates="received_invitations",
        foreign_keys=[invitee_id],
    )

    __table_args__ = (
        UniqueConstraint(
            "ride_id",
            "invitee_id",
            name="uq_ride_invitation",
        ),

        CheckConstraint(
            "inviter_id != invitee_id",
            name="ck_inviter_not_invitee",
        ),
    )


# ============================================================
# DRIVER OFFERS
# ============================================================

class DriverOffer(Base):
    __tablename__ = "driver_offers"

    id = Column(Integer, primary_key=True)

    ride_id = Column(
        Integer,
        ForeignKey("rides.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    driver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    status = Column(
        pg_enum(OfferStatus, "offer_status"),
        nullable=False,
        default=OfferStatus.sent,
    )

    sent_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    responded_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    ride = relationship(
        "Ride",
        back_populates="driver_offers",
    )

    driver = relationship(
        "User",
        foreign_keys=[driver_id],
    )

    __table_args__ = (
        UniqueConstraint(
            "ride_id",
            "driver_id",
            name="uq_ride_driver_offer",
        ),
    )


# ============================================================
# DRIVER LOCATION HISTORY
# ============================================================

class DriverLocation(Base):
    __tablename__ = "driver_locations"

    id = Column(Integer, primary_key=True)

    driver_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    location = Column(
        Geography(
            geometry_type="POINT",
            srid=4326,
            spatial_index=False,
        ),
        nullable=False,
    )

    recorded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )


# ============================================================
# PAYMENTS
# ============================================================

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)

    participant_id = Column(
        Integer,
        ForeignKey("ride_participants.id"),
        nullable=False,
        index=True,
    )

    # Individual passenger contribution in pesewas.
    amount_pesewas = Column(Integer, nullable=False)

    currency = Column(String(3), nullable=False, default="GHS")

    status = Column(
        pg_enum(PaymentStatus, "payment_status"),
        nullable=False,
        default=PaymentStatus.pending,
        index=True,
    )

    provider = Column(String(50), nullable=True)

    provider_payment_id = Column(
        String(255),
        nullable=True,
        unique=True,
    )

    failure_reason = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    paid_at = Column(DateTime(timezone=True), nullable=True)

    refunded_at = Column(DateTime(timezone=True), nullable=True)

    participant = relationship(
        "RideParticipant",
        back_populates="payments",
    )

    __table_args__ = (
        CheckConstraint(
            "amount_pesewas > 0",
            name="ck_payment_amount_positive",
        ),
    )


# ============================================================
# INCOMING PAYMENT WEBHOOK EVENTS
# ============================================================

class PaymentWebhookEvent(Base):
    __tablename__ = "payment_webhook_events"

    id = Column(Integer, primary_key=True)

    provider = Column(String(50), nullable=False)

    # Unique ID supplied by the payment provider.
    provider_event_id = Column(String(255), nullable=False, unique=True)

    event_type = Column(String(150), nullable=False)

    processing_status = Column(
        String(30),
        nullable=False,
        default="PENDING",
    )

    payload = Column(Text, nullable=False)

    received_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    processed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )
