class AppError(Exception):
    """Base class for errors we want to return to the client in a clean way."""

    def __init__(self, message: str, *, code: str = "app_error", status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class JobNotFound(AppError):
    def __init__(self, job_id: str):
        super().__init__(
            message=f"Job not found: {job_id}",
            code="job_not_found",
            status_code=404,
        )
