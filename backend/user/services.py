from user.schema import EmployeeData
import user.repository
from core.exceptions import AppException
from sqlalchemy.orm import Session
from user.models import User


def create_user(data: EmployeeData, db: Session):

    existing_user = user.repository.get_by_email(data.email, db)

    if existing_user:
        AppException.user_already_exists()



    return user.repository.create_user(
        data,
        db
    )


def update_employee_admin(db:Session,emp_id:str,email:str,phone:str,full_name:str):
    emp=user.repository.search_employee(emp_id,db)
    if emp is None:
        AppException.user_not_found()

    return user.repository.update_data(db,emp,email,phone,full_name)



def update_employee_me(db:Session,current_user:User,email:str,phone:str,full_name:str):
    return user.repository.update_data(db,current_user,email,phone,full_name)



