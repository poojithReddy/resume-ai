from collections.abc import Generator

from sqlalchemy.orm import Session

from resume_ai_api.db.session import SessionLocal


def get_db_session() -> Generator[Session, None, None]:
    db_session = SessionLocal()

    try:
        yield db_session
    finally:
        db_session.close()