from core.config import ACCESS_SECRETKEY,ALGORITHM,REFRESH_SECRETKEY
import bcrypt
from jose import jwt
from datetime import timedelta,timezone,datetime
from uuid import uuid4




def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_access_token(data:dict,expiretime:int|None=None):
    to_encoded=data.copy()
    if expiretime:
        expires=datetime.now(timezone.utc)+timedelta(minutes=expiretime)
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

def create_refresh_token(data:dict,expiretime:int|None=None):
    to_encoded=data.copy()
    if expiretime:
        expires=datetime.now(timezone.utc)+timedelta(days=expiretime)
    else:
        expires=datetime.now(timezone.utc)+timedelta(days=7)

    jti = str(uuid4())

    to_encoded.update({"exp":expires,"jti":jti,"type":"refresh"})
    encoded_jwt=jwt.encode(to_encoded,REFRESH_SECRETKEY,algorithm=ALGORITHM)
    return encoded_jwt
























