"""
This module is intentionally kept minimal.

Database schema is managed via Alembic migrations.
Do NOT use Base.metadata.create_all() in this project.
"""


def init_db():
    # No-op: migrations are handled by Alembic
    pass