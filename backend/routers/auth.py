from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
import secrets
import string

from database import get_session
from models import User, LoginHistory

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Password hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserCreate(BaseModel):
    email: str
    password: str
    parent_phone: Optional[str] = None
    is_verified: Optional[bool] = False

class UserLogin(BaseModel):
    email: str
    password: str

class VerifyCode(BaseModel):
    email: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_verification_code():
    return ''.join(secrets.choice(string.digits) for _ in range(6))

@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    db_user = session.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Generate verification code
    verification_code = generate_verification_code()
    
    # Create user
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        is_verified=user.is_verified, # Use the verification status from the request
        verification_code=None if user.is_verified else verification_code,
        parent_phone=user.parent_phone
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # In a real app, send email with verification_code
    print(f"Verification code for {user.email}: {verification_code}")
    
    return {
        "message": "User registered. Check console for verification code.",
        "verification_code": verification_code
    }

@router.post("/verify")
def verify_email(verify: VerifyCode, session: Session = Depends(get_session)):
    db_user = session.query(User).filter(User.email == verify.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")
    
    if db_user.verification_code != verify.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    db_user.is_verified = True
    db_user.verification_code = None
    session.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, session: Session = Depends(get_session)):
    db_user = session.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    # Log login activity
    history = LoginHistory(user_id=db_user.id)
    session.add(history)
    session.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}