from sqlalchemy.orm import Session
from sqlalchemy import select
from user.models import User
from user.schema import EmployeeData
import core.security
import uuid6
from auth.models import RevokedToken,RefreshToken
from datetime import datetime
def search_employee(emp_id:str,db:Session):
    stmt=select(User).where(User.emp_id==emp_id)
    data=db.scalar(stmt)
    return data

def get_by_email(email:str,db:Session):
    stmt = select(User).where(User.email == email)
    data = db.scalar(stmt)
    return data


def create_user(data:EmployeeData,db:Session):
    uid=uuid6.uuid7()
    user=User(
        id=uid,
        emp_id=f"LIV{uid.hex[-6:].upper()}",
        name=data.full_name,
        email=data.email,
        phone=data.phone,
        hashed_password=core.security.hash_password(data.password)
        )

    db.add(user)
    db.commit()
    db.refresh(user)

    print({"ID":user.id,"EMP_ID":user.emp_id})

    return user

def account_activation(db:Session,emp_id:str):
    stmt=select(User.is_active).where(User.emp_id==emp_id)
    is_active=db.scalar(stmt)
    return is_active


def update_data(db:Session,user:User,email:str,phone:str,full_name:str):
    if email is not None:
        user.email=email
    if phone is not None:
        user.phone=phone
    if full_name is not None:
        user.name=full_name

    db.commit()
    db.refresh(user)
    return user

def account_enable_disable(db:Session,user:User):
    user.is_active=False
    db.commit()
    db.refresh(user)


def access_token_expire(db:Session,jti:str,expire_at:datetime):
    data=RevokedToken(
        jti=jti,
        expires_at=expire_at

    )

    db.add(data)
    db.commit()

    return data

def refresh_token_expire(db:Session,jti:str,expire_at:datetime):
    data=RefreshToken(
        jti=jti,
        expires_at=expire_at

    )

    db.add(data)
    db.commit()

    return data





