from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.orm import Session
from .. import models,schemas,utils,oauth
from ..database import get_db


router = APIRouter(
    tags=["Users"],
    prefix="/user"
)


# @router.post("/")