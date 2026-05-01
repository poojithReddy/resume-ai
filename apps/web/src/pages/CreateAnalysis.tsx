import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { createJob } from "@/lib/api";

export default function CreateAnalysis() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    try {
      const result = await createJob({
        job_title: jobTitle,
        resume_text: resume,
        job_description_text: jobDescription,
      });

      navigate(`/results/${result.job_id}`);
    } catch {
      alert("Failed to create analysis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <Card padding="lg">
          <PageHeader
            title="Create Analysis"
            subtitle="Analyze your resume against a job description"
          />

          <div className="space-y-4 mt-4">
            <TextField
              label="Job Title"
              name="job_title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2"
              placeholder="Paste resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />

            <textarea
              className="w-full border p-2"
              placeholder="Paste job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Analyze"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}