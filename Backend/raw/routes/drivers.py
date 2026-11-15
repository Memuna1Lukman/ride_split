from fastapi import APIRouter,HTTPException,Depends,status
from .. import models,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement


router = APIRouter(
    tags=["Drivers"],
    prefix="/drivers"
)


