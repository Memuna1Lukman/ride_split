from fastapi import FastAPI,Response
from . import models
from .database import engine
from .routes import auth,user,rides,drivers
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

@app.get("/")
def greeting():
    return {"message":"Good Afternoon memuna"}

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(rides.router)
app.include_router(drivers.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)