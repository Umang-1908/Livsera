from fastapi import APIRouter,Depends,Response,Cookie
from typing import Optional
from sqlalchemy.orm import Session
from auth.dependencies import getdb,current_users,oauth_schema
from auth.schema import Token,ChangePassword
from fastapi.security import OAuth2PasswordRequestForm
from auth.services import authenticate,password_update,account_update,revoke_accesstoken,revoke_refreshtoken,refresh_auth_token
from user.models import User

router=APIRouter(prefix="/auth",tags=["Authenticate"])


@router.post("/login", response_model=Token)
def login(
    response: Response,
    data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(getdb)
):

    auth_data = authenticate(db, data.username, data.password)

    response.set_cookie(
        key="refresh_token",
        value=auth_data["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        path="/auth/refresh",
        max_age=7 * 24 * 3600
    )


    return {
        "access_token": auth_data["access_token"],
        "token_type": auth_data["token_type"]
    }

@router.post("/change_password")
def change_password(data:ChangePassword,db:Session=Depends(getdb),current_user:User=Depends(current_users)):
    return password_update(data.old_password,data.new_password,db,current_user)

@router.delete("/delete")
def delete_account(current_user:User=Depends(current_users),db:Session=Depends(getdb)):
    return  account_update(db,current_user.emp_id)



@router.post("/logout")
def logout(
    response: Response,
    token: str = Depends(oauth_schema),
    current_user: User = Depends(current_users),
    refresh_token: Optional[str] = Cookie(None),
    db: Session = Depends(getdb),
):

    revoke_accesstoken(db, token)


    if refresh_token:
        revoke_refreshtoken(db, refresh_token)

    response.delete_cookie(
        key="refresh_token",
        path="/auth/refresh",
        httponly=True,
        samesite="lax"
    )

    return {"message": "Logout successfully"}

@router.post("/refresh", response_model=Token)
def refresh_access_token(
    refresh_token: Optional[str] = Cookie(None),
    db: Session = Depends(getdb)
):
    return refresh_auth_token(db,refresh_token)

