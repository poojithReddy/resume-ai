import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { createJob } from "@/lib/api";

export default function CreateAnalysis() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await createJob({
        job_title: jobTitle,
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
      });

      navigate(`/results/${result.job_id}`);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to create analysis");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <Card padding="lg">
          <div className="space-y-6">
            <PageHeader
              title="Create Analysis"
              subtitle="Paste a job description and resume to create a saved analysis."
            />

            <form className="space-y-4" onSubmit={handleSubmit}>
              <TextField
                label="Job Title"
                name="job_title"
                placeholder="e.g. Frontend Developer"
                value={jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setJobTitle(e.target.value)
                }
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Resume</label>
                <textarea
                  className="w-full rounded border px-3 py-2 min-h-[140px]"
                  value={resumeText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResumeText(e.target.value)
                  }
                  placeholder="Paste resume text here..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <textarea
                  className="w-full rounded border px-3 py-2 min-h-[140px]"
                  value={jobDescriptionText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setJobDescriptionText(e.target.value)
                  }
                  placeholder="Paste job description here..."
                  required
                />
              </div>

              {errorMessage ? (
                <div className="text-sm text-red-600">{errorMessage}</div>
              ) : null}

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Analysis"}
                </Button>

                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting}
                >
                  Back to Dashboard
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}