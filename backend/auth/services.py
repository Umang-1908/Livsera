from sqlalchemy.orm import Session
from user.repository import search_employee,account_activation,account_enable_disable,token_expire
from core.security import verify_password,create_access_token,hash_password,decode_token
from core.exceptions import AppException
from core.config import ACCESS_TOKEN_EXPIRE_TIME
from user.models import User
from datetime import datetime,timezone

def authenticate(db:Session,emp_id:str,password:str):
    user=search_employee(emp_id,db)

    if not user:
        AppException.user_not_found()

    if not verify_password(password,user.hashed_password):
        AppException.unauthorized()


    if not account_activation(db,user.emp_id):
        AppException.forbidden()

    token = create_access_token({"sub": user.emp_id}, ACCESS_TOKEN_EXPIRE_TIME)
    return {"access_token": token, "token_type": "bearer"}





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

    payload = decode_token(token)

    jti = payload["jti"]
    expires_at = datetime.fromtimestamp(
        payload["exp"],
        tz=timezone.utc
    )

    return token_expire(db,jti,expires_at)


