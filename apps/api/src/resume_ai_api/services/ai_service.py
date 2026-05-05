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

Return ONLY valid JSON in this exact format:

{{
  "score": 0,
  "match_band": "Poor",
  "summary": "short summary",
  "matched_points": ["point 1", "point 2"],
  "missing_points": ["point 1", "point 2"]
}}

Rules:
- score must be an integer from 0 to 100
- match_band must be one of: Excellent, Good, Poor
- summary must be concise
- matched_points must be a list of strings (max 5)
- missing_points must be a list of strings (max 5)
- DO NOT include any explanation outside JSON

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

            output_text = getattr(response, "output_text", None)

            if not output_text:
                raise AppError(
                    "Empty response from AI",
                    code="AI_EMPTY_RESPONSE",
                    status_code=500,
                )

            # Extract JSON safely
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

            # Validate & normalize response
            score = int(data.get("score", 0))
            score = max(0, min(100, score))  # clamp 0–100

            matched_points = data.get("matched_points", [])
            missing_points = data.get("missing_points", [])

            if not isinstance(matched_points, list):
                matched_points = []

            if not isinstance(missing_points, list):
                missing_points = []

            return Scorecard(
                score=score,
                match_band=data.get("match_band", "Poor"),
                summary=data.get("summary", ""),
                matched_points=[str(p) for p in matched_points][:5],
                missing_points=[str(p) for p in missing_points][:5],
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