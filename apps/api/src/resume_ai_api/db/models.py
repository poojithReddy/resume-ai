from datetime import datetime
import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from resume_ai_api.core.constants import USER_ROLE
from resume_ai_api.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    name: Mapped[str] = mapped_column(String, nullable=False)

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(String, nullable=False)

    role: Mapped[str] = mapped_column(
        String,
        nullable=False,
        default=USER_ROLE,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    target_jobs: Mapped[list["Job"]] = relationship(
        "Job",
        foreign_keys="Job.target_user_id",
        back_populates="target_user",
    )

    actor_jobs: Mapped[list["Job"]] = relationship(
        "Job",
        foreign_keys="Job.actor_id",
        back_populates="actor",
    )


class Job(Base):
    __tablename__ = "jobs"

    job_id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
    )

    job_title: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    job_role_category: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    job_role_custom: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    resume_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    job_description_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    analysis_completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    target_user_id: Mapped[str | None] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    actor_id: Mapped[str | None] = mapped_column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    match_band: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    matched_points: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    missing_points: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    target_user: Mapped["User | None"] = relationship(
        "User",
        foreign_keys=[target_user_id],
        back_populates="target_jobs",
    )

    actor: Mapped["User | None"] = relationship(
        "User",
        foreign_keys=[actor_id],
        back_populates="actor_jobs",
    )