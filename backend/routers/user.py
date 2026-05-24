from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_session
from models import User, LoginHistory
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

class UserUpdate(BaseModel):
    email: Optional[str] = None
    parent_phone: Optional[str] = None
    theme: Optional[str] = None
    notif_quiz: Optional[bool] = None
    notif_docs: Optional[bool] = None
    profile_image: Optional[str] = None

class LoginActivitySchema(BaseModel):
    timestamp: datetime
    ip_address: Optional[str]

@router.get("/me")
def get_current_user(email: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/update")
def update_user(email: str, data: UserUpdate, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if data.email: user.email = data.email
    if data.parent_phone: user.parent_phone = data.parent_phone
    if data.theme: user.theme = data.theme
    if data.notif_quiz is not None: user.notif_quiz = data.notif_quiz
    if data.notif_docs is not None: user.notif_docs = data.notif_docs
    if data.profile_image: user.profile_image = data.profile_image
    
    session.commit()
    return {"message": "Profile updated successfully"}

@router.get("/activity")
def get_login_activity(email: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    activities = session.query(LoginHistory).filter(LoginHistory.user_id == user.id).order_by(LoginHistory.timestamp.desc()).limit(5).all()
    return activities

@router.delete("/delete")
def delete_account(email: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    session.delete(user)
    session.commit()
    return {"message": "Account deleted successfully"}
