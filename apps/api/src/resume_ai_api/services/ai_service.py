import json

from openai import OpenAI

from resume_ai_api.core.errors import AppError
from resume_ai_api.core.settings import settings
from resume_ai_api.schemas.jobs import Scorecard


class AIService:
    def __init__(self):
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    def generate_scorecard(
        self,
        *,
        job_title: str,
        resume_text: str,
        job_description_text: str,
    ) -> Scorecard:
        prompt = f"""
You are an assistant that evaluates how well a resume matches a job description.

Return ONLY valid JSON with this exact shape:
{{
  "score": 0,
  "match_band": "Poor",
  "summary": "short summary",
  "matched_points": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "missing_points": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}}

Rules:
- score must be an integer from 0 to 100
- match_band must be one of: Excellent, Good, Poor
- summary must be short and clear
- matched_points must contain up to 5 concise bullet-style strings
- missing_points must contain up to 5 concise bullet-style strings

Job title:
{job_title}

Resume:
{resume_text}

Job description:
{job_description_text}
""".strip()

        try:
            response = self._client.responses.create(
                model=self._model,
                input=prompt,
            )

            output_text = response.output_text
            data = json.loads(output_text)

            return Scorecard(**data)

        except Exception as exc:
            raise AppError(
                f"AI scoring failed: {str(exc)}",
                code="AI_SCORING_FAILED",
                status_code=500,
            )