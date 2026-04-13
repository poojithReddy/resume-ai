from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from resume_ai_api.db.models import User


class UserRepository:
    def __init__(self, db: Session):
        self._db = db

    def get_by_email(self, email: str) -> User | None:
        return (
            self._db.query(User)
            .filter(User.email == email)
            .first()
        )

    def create_user(self, name: str, email: str, password_hash: str) -> User:
        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
        )

        try:
            self._db.add(user)
            self._db.commit()
            self._db.refresh(user)
            return user
        except IntegrityError:
            self._db.rollback()
            raise