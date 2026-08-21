from core.database import Base,engine
from sqlalchemy import String,DateTime,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column
from datetime import datetime,timezone
from uuid import UUID
from user.models import User


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    jti: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    token_hash: Mapped[str] = mapped_column(
        String(128),
        unique=True,
        nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    revoked_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )


Base.metadata.create_all(bind=engine)

