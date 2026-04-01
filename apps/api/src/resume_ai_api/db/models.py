from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String


class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    job_id: Mapped[str] = mapped_column(primary_key=True)
    resume_text: Mapped[str] = mapped_column(String, nullable=False)
    job_description_text: Mapped[str] = mapped_column(String, nullable=False)