from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import Depends,Cookie
from user.repository import search_employee,account_activation,account_enable_disable,access_token_expire
from core.security import verify_password,create_access_token,hash_password,create_refresh_token,access_decode_token,refresh_decode_token
from core.exceptions import AppException
from core.config import ACCESS_TOKEN_EXPIRE_TIME
from user.models import User
from datetime import datetime,timezone
from typing import Optional
from auth.models import RefreshToken
from jose import JWTError


def authenticate(db: Session, emp_id: str, password: str):
    user = search_employee(emp_id, db)

    if not user:
        AppException.user_not_found()

    if not verify_password(password, user.hashed_password):
        AppException.unauthorized()

    if not account_activation(db, user.emp_id):
        AppException.forbidden()


    payload_data = {"sub": user.emp_id}


    access_token = create_access_token(payload_data, ACCESS_TOKEN_EXPIRE_TIME)
    refresh_token = create_refresh_token(payload_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }




def password_update(old_password:str,new_password:str,db:Session,user:User):
    if not verify_password(old_password,user.hashed_password):
        AppException.unauthorized()
    if old_password==new_password:
        AppException.password_valid()

    user.hashed_password=hash_password(new_password)

    db.commit()
    db.refresh(user)
    return {"message": "Password changed Successfully"}


def account_update(db:Session,emp_id):
    user = search_employee(emp_id, db)
    if user is None:
        AppException.user_not_found()
    return account_enable_disable(db,user)

def revoke_token(db: Session, token: str):

    payload = access_decode_token(token)

    jti = payload["jti"]
    expires_at = datetime.fromtimestamp(
        payload["exp"],
        tz=timezone.utc
    )

    return access_token_expire(db,jti,expires_at)


def refresh_auth_token(
    db:Session,refresh_token: Optional[str] = Cookie(None),

):
    if not refresh_token:
        AppException.unauthorized()

    try:
        payload = refresh_decode_token(refresh_token)
        jti: str | None = payload.get("jti")
        emp_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")


        if not emp_id or not jti or token_type != "refresh":
            AppException.unauthorized()


        revoked_token = db.scalar(
            select(RefreshToken).where(RefreshToken.jti == jti)
        )
        if revoked_token:
            AppException.unauthorized()

        new_access_token = create_access_token(
            data={"sub": emp_id},
            expiretime=ACCESS_TOKEN_EXPIRE_TIME
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    except JWTError:
        AppException.unauthorized()
