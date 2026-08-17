from core.config import SECRETKEY,ALGORITHM
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



    to_encoded.update({"exp":expires,"jti":jti})
    encoded_jwt=jwt.encode(to_encoded,SECRETKEY,algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token:str):
    return jwt.decode(token,SECRETKEY,algorithms=[ALGORITHM])



















