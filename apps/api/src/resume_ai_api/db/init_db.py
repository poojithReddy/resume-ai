from resume_ai_api.db.models import Base
from resume_ai_api.db.session import engine


def init_db() -> None:
    Base.metadata.create_all(bind=engine)