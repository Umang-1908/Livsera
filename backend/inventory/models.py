from core.database import Base
from sqlalchemy.orm import Mapped,mapped_column
from uuid import UUID
from sqlalchemy import String,Numeric,DateTime
from decimal import Decimal
import uuid6
from datetime import datetime,timezone


class Medicine(Base):
    __tablename__="medicine"
    id:Mapped[UUID]=mapped_column(primary_key=True,default=uuid6.uuid7)
    name:Mapped[str]=mapped_column(String(100),nullable=False)
    form:Mapped[str]=mapped_column(String(50),nullable=False)
    category:Mapped[str]=mapped_column(String(60),nullable=False)
    dosage_num:Mapped[Decimal]=mapped_column(Numeric(10,3),nullable=False)
    dosage_unit:Mapped[str]=mapped_column(String(20),nullable=False)
    minimum_stock:Mapped[int]=mapped_column(nullable=False)
    unit_price:Mapped[Decimal]=mapped_column(Numeric(12,3),nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True,nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),onupdate=lambda: datetime.now(timezone.utc),nullable=False)

