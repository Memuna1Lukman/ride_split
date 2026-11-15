from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .config import settings, sqlalchemy_url


engine = create_engine(sqlalchemy_url(settings.database_url))


SessionLocal = sessionmaker(autoflush=False,autocommit=False,bind=engine)


Base= declarative_base()
   


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
