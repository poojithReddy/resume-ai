from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgre123@localhost:5432/resume_ai"


settings = Settings()