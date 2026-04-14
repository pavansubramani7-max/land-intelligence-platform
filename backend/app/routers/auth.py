from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserLogin, Token, TokenRefresh, OTPVerify
from app.services.auth_service import (
    register_user, authenticate_user, create_tokens,
    refresh_access_token, verify_otp, get_user_by_id,
    send_phone_otp, verify_phone_otp
)
from app.utils.security import get_current_user_id
from app.middleware.rate_limiter import limiter

router = APIRouter()


class PhoneRequest(BaseModel):
    phone: str

class PhoneOTPVerify(BaseModel):
    phone: str
    otp_code: str


@router.post("/register", response_model=UserOut, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    access_token, refresh_token = create_tokens(user)
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=dict)
def refresh(body: TokenRefresh):
    new_token = refresh_access_token(body.refresh_token)
    return {"access_token": new_token, "token_type": "bearer"}


@router.post("/otp/verify", response_model=Token)
def verify_otp_endpoint(body: OTPVerify, db: Session = Depends(get_db)):
    verify_otp(db, body.email, body.otp_code)
    user = db.query(User).filter(User.email == body.email).first()
    access_token, refresh_token = create_tokens(user)
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/change-password")
def change_password(
    body: dict,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    from app.utils.security import verify_password, hash_password
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(body.get("current_password", ""), user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.hashed_password = hash_password(body["new_password"])
    db.commit()
    return {"message": "Password changed successfully"}


    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/phone/send-otp")
def send_otp(body: PhoneRequest, db: Session = Depends(get_db)):
    otp = send_phone_otp(db, body.phone)
    response: dict = {"message": "OTP sent successfully"}
    # In dev mode return OTP directly so no SMS setup needed
    from app.config import settings
    if settings.DEBUG:
        response["otp"] = otp
        response["note"] = "Dev mode: OTP returned in response"
    return response


@router.post("/phone/verify-otp", response_model=Token)
def verify_phone(body: PhoneOTPVerify, db: Session = Depends(get_db)):
    user = verify_phone_otp(db, body.phone, body.otp_code)
    access_token, refresh_token = create_tokens(user)
    return Token(access_token=access_token, refresh_token=refresh_token)
