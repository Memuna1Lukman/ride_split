"""Pydantic request and response schemas for the Ride Split API.

These schemas describe the API boundary; database constraints and transactional
business rules still belong in the service/router layer.
"""

from datetime import datetime
from typing import Annotated, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

from .models import (
    DriverStatus,
    InvitationStatus,
    OfferStatus,
    PaymentStatus,
    RideStatus,
    Role,
)


Pesewas = Annotated[int, Field(ge=0, description="Amount in integer pesewas.")]


class APIModel(BaseModel):
    """Base for response schemas that can be built from ORM objects."""

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    id: Optional[int] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class Message(BaseModel):
    message: str


class Location(BaseModel):
    """A WGS-84 point. Longitude is the x-coordinate; latitude is y."""

    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str = Field(min_length=7, max_length=20)
    role: Role = Role.passenger

    # Required only when registering a driver. They are deliberately not
    # included in UserOut because they live on DriverProfile, not User.
    vehicle_type: Optional[str] = Field(default=None, min_length=1, max_length=100)
    plate_number: Optional[str] = Field(default=None, min_length=1, max_length=30)
    capacity: Optional[int] = Field(default=None, gt=0, le=100)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        # EmailStr is a validation annotation, not a runtime constructor.
        return str(value).strip().lower()

    @model_validator(mode="after")
    def require_driver_vehicle_details(self) -> "UserCreate":
        if self.role == Role.driver and not all(
            (self.vehicle_type, self.plate_number, self.capacity)
        ):
            raise ValueError(
                "vehicle_type, plate_number and capacity are required for drivers"
            )
        return self


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)


class UserOut(APIModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    role: Role
    is_active: bool
    created_at: datetime


class DriverProfileCreate(BaseModel):
    vehicle_type: str = Field(min_length=1, max_length=100)
    plate_number: str = Field(min_length=1, max_length=30)
    capacity: int = Field(gt=0, le=100)


class DriverProfileUpdate(BaseModel):
    vehicle_type: Optional[str] = Field(default=None, min_length=1, max_length=100)
    plate_number: Optional[str] = Field(default=None, min_length=1, max_length=30)
    capacity: Optional[int] = Field(default=None, gt=0, le=100)


class DriverStatusUpdate(BaseModel):
    status: DriverStatus


class DriverLocationUpdate(Location):
    recorded_at: Optional[datetime] = None


class DriverProfileOut(APIModel):
    user_id: int
    vehicle_type: str
    plate_number: str
    capacity: int
    status: DriverStatus
    location_updated_at: Optional[datetime] = None
    version: int


class RideCreate(BaseModel):
    pickup_location: Location
    dropoff_location: Location
    capacity: int = Field(default=4, gt=0, le=100)
    estimated_fare_pesewas: Optional[Pesewas] = None
    currency: str = Field(default="GHS", min_length=3, max_length=3)
    idempotency_key: Optional[str] = Field(default=None, min_length=1, max_length=255)

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return value.upper()

    @model_validator(mode="after")
    def require_distinct_locations(self) -> "RideCreate":
        if self.pickup_location == self.dropoff_location:
            raise ValueError("pickup and dropoff locations must be different")
        return self


class RideUpdate(BaseModel):
    capacity: Optional[int] = Field(default=None, gt=0, le=100)
    estimated_fare_pesewas: Optional[Pesewas] = None


class RideStatusUpdate(BaseModel):
    status: RideStatus


class RideFareFinalize(BaseModel):
    final_fare_pesewas: Pesewas
    currency: str = Field(default="GHS", min_length=3, max_length=3)

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return value.upper()


class RideParticipantOut(APIModel):
    id: int
    ride_id: int
    user_id: int
    is_creator: bool
    joined_at: datetime
    fare_share_pesewas: Optional[int] = None


class RideInvitationCreate(BaseModel):
    invitee_id: int = Field(gt=0)


class RideInvitationRespond(BaseModel):
    status: InvitationStatus

    @model_validator(mode="after")
    def only_allow_a_response(self) -> "RideInvitationRespond":
        if self.status not in (InvitationStatus.accepted, InvitationStatus.declined):
            raise ValueError("an invitation can only be accepted or declined")
        return self


class RideInvitationOut(APIModel):
    id: int
    ride_id: int
    inviter_id: int
    invitee_id: int
    status: InvitationStatus
    invited_at: datetime
    responded_at: Optional[datetime] = None


class DriverOfferRespond(BaseModel):
    status: OfferStatus

    @model_validator(mode="after")
    def only_allow_a_response(self) -> "DriverOfferRespond":
        if self.status not in (OfferStatus.accepted, OfferStatus.rejected):
            raise ValueError("an offer can only be accepted or rejected")
        return self


class DriverOfferOut(APIModel):
    id: int
    ride_id: int
    driver_id: int
    status: OfferStatus
    sent_at: datetime
    responded_at: Optional[datetime] = None


class RideOut(APIModel):
    id: int
    creator_id: int
    driver_id: Optional[int] = None
    capacity: int
    estimated_fare_pesewas: Optional[int] = None
    final_fare_pesewas: Optional[int] = None
    currency: str
    status: RideStatus
    requested_at: datetime
    driver_assigned_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    version: int


class PaymentCreate(BaseModel):
    participant_id: int = Field(gt=0)
    amount_pesewas: int = Field(gt=0)
    currency: str = Field(default="GHS", min_length=3, max_length=3)
    provider: Optional[str] = Field(default=None, max_length=50)


class PaymentStatusUpdate(BaseModel):
    status: PaymentStatus
    provider_payment_id: Optional[str] = Field(default=None, max_length=255)
    failure_reason: Optional[str] = None


class PaymentOut(APIModel):
    id: int
    participant_id: int
    amount_pesewas: int
    currency: str
    status: PaymentStatus
    provider: Optional[str] = None
    provider_payment_id: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    paid_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None
