from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth.dependencies import getdb
from user.schema import EmployeeData, UserResponse,EmployeeUpdate
from user.services import create_user,update_employee_me,update_employee_admin
from user.models import User
from auth.dependencies import current_users

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post(
    "/employees",
    response_model=UserResponse
)
def create_employee(
    data: EmployeeData,
    db: Session = Depends(getdb)
):
    return create_user(data, db)

@router.patch("/update/employees/{emp_id}",response_model=UserResponse)
def update(data:EmployeeUpdate,emp_id:str,db:Session=Depends(getdb)):
    return update_employee_admin(db,emp_id,data.email,data.phone,data.full_name)

@router.patch("/update/me",response_model=UserResponse)
def update(data:EmployeeUpdate,current_user:User=Depends(current_users),db:Session=Depends(getdb)):
    return update_employee_me(db,current_user,data.email,data.phone,data.full_name)


