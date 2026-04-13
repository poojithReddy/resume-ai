from resume_ai_api.db.session import engine, Base

# Import models so SQLAlchemy registers them
from resume_ai_api.db import models  # noqa


def init_db():
    Base.metadata.create_all(bind=engine)