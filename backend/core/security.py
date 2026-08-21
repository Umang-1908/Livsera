from core.config import ACCESS_SECRETKEY,ALGORITHM,REFRESH_SECRETKEY
from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta,timezone,datetime
from uuid import uuid4


pwd=CryptContext(schemes=['bcrypt'],deprecated='auto')

def hash_password(password:str):
    return pwd.hash(password)


def verify_password(password:str,hashed_password:str):
    return pwd.verify(password,hashed_password)

def create_access_token(data:dict,expiretime:timedelta|None=None):
    to_encoded=data.copy()
    if expiretime:
        expires=datetime.now(timezone.utc)+expiretime
    else:
        expires=datetime.now(timezone.utc)+timedelta(minutes=15)

    jti=str(uuid4())
    to_encoded.update({"exp":expires,"jti":jti,"type":"access"})
    encoded_jwt=jwt.encode(to_encoded,ACCESS_SECRETKEY,algorithm=ALGORITHM)
    return encoded_jwt

def access_decode_token(token:str):
    return jwt.decode(token,ACCESS_SECRETKEY,algorithms=[ALGORITHM])

def refresh_decode_token(token:str):
    return jwt.decode(token,REFRESH_SECRETKEY,algorithms=[ALGORITHM])

def create_refresh_token(data:dict,expiretime:timedelta|None=None):
    to_encoded=data.copy()
    if expiretime:
        expires=datetime.now(timezone.utc)+expiretime
    else:
        expires=datetime.now(timezone.utc)+timedelta(days=7)

    jti = str(uuid4())

    to_encoded.update({"exp":expires,"jti":jti,"type":"refresh"})
    encoded_jwt=jwt.encode(to_encoded,REFRESH_SECRETKEY,algorithm=ALGORITHM)
    return encoded_jwt
























