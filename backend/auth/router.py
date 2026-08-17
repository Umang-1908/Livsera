from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from auth.dependencies import getdb,current_users,oauth_schema
from auth.schema import Token,ChangePassword
from fastapi.security import OAuth2PasswordRequestForm
from auth.services import authenticate,password_update,account_update,revoke_token
from user.models import User

router=APIRouter(prefix="/auth",tags=["Authenticate"])


@router.post("/login",response_model=Token)
def login(data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(getdb)):
    return authenticate(db,data.username,data.password)

@router.post("/change_password")
def change_password(data:ChangePassword,db:Session=Depends(getdb),current_user:User=Depends(current_users)):
    return password_update(data.old_password,data.new_password,db,current_user)

@router.delete("/delete")
def delete_account(current_user:User=Depends(current_users),db:Session=Depends(getdb)):
    return  account_update(db,current_user.emp_id)


@router.post("/logout")
def logout(token:str=Depends(oauth_schema),db:Session=Depends(getdb)):
    revoke_token(db,token)
    return {"message":"Logout successfully"}

