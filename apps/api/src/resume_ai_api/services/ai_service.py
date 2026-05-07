import json

from openai import OpenAI

from resume_ai_api.core.errors import AppError
from resume_ai_api.core.settings import settings
from resume_ai_api.schemas.jobs import Scorecard


ALLOWED_MATCH_BANDS = [
    "Excellent",
    "Very Good",
    "Good",
    "Average",
    "Poor",
]


class AIService:
    def __init__(self):
        self._client = OpenAI(
            api_key=settings.openai_api_key
        )

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

Evaluate how well the resume matches the job description.

Return ONLY valid JSON in this exact format:

{{
  "score": 0,
  "match_band": "Poor",
  "summary": "short summary",
  "matched_points": ["point 1", "point 2"],
  "missing_points": ["point 1", "point 2"],
  "ai_feedback": "short improvement feedback"
}}

Rules:
- score must be integer between 0 and 100
- match_band must be one of:
  Excellent
  Very Good
  Good
  Average
  Poor
- summary must be concise
- matched_points maximum 5
- missing_points maximum 5
- ai_feedback should contain short actionable resume improvement advice
- Return ONLY JSON
- No markdown
- No explanation outside JSON

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

            output_text = getattr(
                response,
                "output_text",
                None,
            )

            if not output_text:
                raise AppError(
                    "Empty response from AI",
                    code="AI_EMPTY_RESPONSE",
                    status_code=500,
                )

            start = output_text.find("{")
            end = output_text.rfind("}") + 1

            if start == -1 or end == 0:
                raise AppError(
                    "Invalid JSON format from AI",
                    code="AI_INVALID_JSON",
                    status_code=500,
                )

            json_text = output_text[start:end]

            data = json.loads(json_text)

            score = int(data.get("score", 0))
            score = max(0, min(100, score))

            matched_points = data.get(
                "matched_points",
                [],
            )

            missing_points = data.get(
                "missing_points",
                [],
            )

            if not isinstance(matched_points, list):
                matched_points = []

            if not isinstance(missing_points, list):
                missing_points = []

            match_band = data.get(
                "match_band",
                "Poor",
            )

            if match_band not in ALLOWED_MATCH_BANDS:
                match_band = "Poor"

            return Scorecard(
                score=score,
                match_band=match_band,
                summary=str(
                    data.get("summary", "")
                ),
                matched_points=[
                    str(p)
                    for p in matched_points
                ][:5],
                missing_points=[
                    str(p)
                    for p in missing_points
                ][:5],
                ai_feedback=str(
                    data.get("ai_feedback", "")
                ),
            )

        except json.JSONDecodeError:
            raise AppError(
                "Failed to parse AI response",
                code="AI_JSON_PARSE_ERROR",
                status_code=500,
            )

        except Exception as exc:
            raise AppError(
                f"AI scoring failed: {str(exc)}",
                code="AI_SCORING_FAILED",
                status_code=500,
            )