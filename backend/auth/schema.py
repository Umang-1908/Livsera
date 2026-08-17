from pydantic import BaseModel


class Token(BaseModel):
    access_token:str
    token_type: str

class Login(BaseModel):
    empid:str
    password:str

class ChangePassword(BaseModel):
    old_password:str
    new_password:str





















