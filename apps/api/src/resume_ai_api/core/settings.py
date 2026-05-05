from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgre123@localhost:5432/resume_ai"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    jwt_secret_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()


if not settings.openai_api_key:
    raise ValueError("OPENAI_API_KEY is missing. Add it to apps/api/.env")

if not settings.jwt_secret_key:
    raise ValueError("JWT_SECRET_KEY is missing. Add it to apps/api/.env")