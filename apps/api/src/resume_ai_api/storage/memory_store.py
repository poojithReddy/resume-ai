"""
Deprecated: In-memory store is no longer used.

This project now uses a PostgreSQL database via SQLAlchemy
and Alembic migrations for persistence.

Keeping this file only to avoid import errors if referenced elsewhere.
"""


class MemoryStore:
    def __init__(self) -> None:
        pass

    def save_job(self, *args, **kwargs) -> None:
        raise NotImplementedError("MemoryStore is deprecated. Use JobRepository instead.")

    def get_job(self, *args, **kwargs):
        raise NotImplementedError("MemoryStore is deprecated. Use JobRepository instead.")