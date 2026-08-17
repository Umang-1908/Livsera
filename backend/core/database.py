from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase,sessionmaker
from core.config import DATABASEURL


engine= create_engine(DATABASEURL,echo=True)

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)


class Base(DeclarativeBase):
    pass

