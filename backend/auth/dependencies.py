from core.database import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from core.security import access_decode_token
from core.exceptions import AppException
from sqlalchemy.orm import Session
import user.repository
from jose import JWTError
from auth.models import RevokedToken
from sqlalchemy import select





oauth_schema=OAuth2PasswordBearer(tokenUrl="/auth/login")


def getdb():
    with SessionLocal() as db:
        yield db


def current_users(token: str = Depends(oauth_schema), db: Session = Depends(getdb)):
    try:
        payload = access_decode_token(token)

        jti: str | None = payload.get("jti")
        emp_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")

        if not emp_id or not jti or token_type != "access":
            AppException.unauthorized()


        revoked_token = db.scalar(
            select(RevokedToken).where(RevokedToken.jti == jti)
        )
        if revoked_token:
            AppException.unauthorized()


        emp = user.repository.search_employee(emp_id, db)
        if not emp:
            AppException.user_not_found()


        if not emp.is_active:
            AppException.unauthorized()


        return emp

    except JWTError:
        AppException.unauthorized()















