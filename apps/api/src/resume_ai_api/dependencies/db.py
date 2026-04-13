from collections.abc import Generator

from sqlalchemy.orm import Session

from resume_ai_api.db.session import SessionLocal


def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()