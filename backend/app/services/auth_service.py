from datetime import datetime, timedelta
import random
import string
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.config import settings


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def _send_sms(phone: str, message: str) -> None:
    """Send SMS via Twilio. Falls back to console log if credentials not set."""
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_ACCOUNT_SID.startswith("AC"):
        print(f"[DEV SMS] To {phone}: {message}")
        return
    from twilio.rest import Client
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(body=message, from_=settings.TWILIO_PHONE_NUMBER, to=phone)


def send_phone_otp(db: Session, phone: str) -> str:
    otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(
            name=None,
            email=None,
            hashed_password=hash_password(generate_otp(12)),
            role="viewer", phone=phone,
        )
        db.add(user)
    user.otp_code = otp
    user.otp_expires_at = otp_expires
    db.commit()
    _send_sms(phone, f"Your Land IQ verification code is {otp}. Valid for {settings.OTP_EXPIRE_MINUTES} minutes.")
    return otp


def verify_phone_otp(db: Session, phone: str, otp_code: str) -> User:
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="Phone number not found")
    if user.otp_code != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if user.otp_expires_at and datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")
    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    return user


def register_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role=user_data.role,
        otp_code=otp,
        otp_expires_at=otp_expires,
        is_verified=settings.DEBUG,  # auto-verify in dev mode
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Always print OTP to terminal so dev can use it without email setup
    print(f"[DEV OTP] Email: {user_data.email} | OTP: {otp}")
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    # In production, enforce email verification. In dev, allow unverified logins.
    if not settings.DEBUG and not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")
    return user


def create_tokens(user: User) -> Tuple[str, str]:
    data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = create_access_token(data)
    refresh_token = create_refresh_token(data)
    return access_token, refresh_token


def refresh_access_token(refresh_token: str) -> str:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    data = {"sub": payload["sub"], "email": payload["email"], "role": payload["role"]}
    return create_access_token(data)


def verify_otp(db: Session, email: str, otp_code: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.otp_code != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if user.otp_expires_at and datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")
    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    return True


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()
