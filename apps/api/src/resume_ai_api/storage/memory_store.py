from dataclasses import dataclass
from typing import Dict, Optional


@dataclass
class JobRecord:
    job_id: str
    resume_text: str
    job_description_text: str


class MemoryStore:
    def __init__(self) -> None:
        self._jobs: Dict[str, JobRecord] = {}

    def save_job(self, job: JobRecord) -> None:
        self._jobs[job.job_id] = job

    def get_job(self, job_id: str) -> Optional[JobRecord]:
        return self._jobs.get(job_id)