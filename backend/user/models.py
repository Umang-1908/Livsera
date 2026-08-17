from core.database import Base,engine
from sqlalchemy import String,Boolean
from sqlalchemy.orm import Mapped,mapped_column
from uuid import UUID




class User (Base):
    __tablename__="users"
    id:Mapped[UUID]=mapped_column(primary_key=True)
    emp_id:Mapped[str]=mapped_column(String(20),index=True,nullable=False,unique=True)
    name:Mapped[str]=mapped_column(String(100),nullable=False)
    email:Mapped[str]=mapped_column(String(100),index=True,nullable=False,unique=True)
    hashed_password:Mapped[str]=mapped_column(String(225),nullable=False)
    phone:Mapped[str]=mapped_column(String(20),unique=True,nullable=False)
    is_active:Mapped[bool]=mapped_column(Boolean,default=True,nullable=False)


Base.metadata.create_all(bind=engine)