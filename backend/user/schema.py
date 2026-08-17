from pydantic import BaseModel,ConfigDict,EmailStr,Field,field_validator
from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    emp_id: str
    name: str
    email: str
    phone: str

    model_config = {
        "from_attributes": True
    }


class EmployeeData(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    email:EmailStr
    full_name:str
    phone:str=Field(pattern=r"^\d{10}$")
    password: str = Field(
        min_length=8,
        max_length=64,

    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:

        if not any(c.islower() for c in value):
            raise ValueError("Password must contain a lowercase letter")

        if not any(c.isupper() for c in value):
            raise ValueError("Password must contain an uppercase letter")

        if not any(c.isdigit() for c in value):
            raise ValueError("Password must contain a digit")

        if not any(not c.isalnum() for c in value):
            raise ValueError("Password must contain a special character")

        return value


class UserInDB(EmployeeData):
    hashed_password:str


class EmployeeUpdate(BaseModel):
        email: EmailStr | None = None
        phone: str | None = Field(
            default=None,
            pattern=r"^[0-9]{10}$"
        )
        full_name: str | None = None
