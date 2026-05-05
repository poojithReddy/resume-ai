import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { createJob } from "@/lib/api";

const ROLE_OPTIONS = [
  { label: "Frontend Developer", value: "software" },
  { label: "Backend Developer", value: "software" },
  { label: "Software Engineer", value: "software" },
  { label: "Data Scientist", value: "data" },
  { label: "AI/ML Engineer", value: "data" },
  { label: "QA Tester", value: "qa_testing" },
  { label: "DevOps Engineer", value: "devops_cloud" },
  { label: "Product Designer", value: "product_design" },
  { label: "Marketing", value: "marketing_sales" },
  { label: "Finance", value: "finance_operations" },
  { label: "Other", value: "other" },
];

export default function CreateAnalysis() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobRoleCategory, setJobRoleCategory] = useState("");
  const [jobRoleCustom, setJobRoleCustom] = useState("");

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!jobTitle || !resume || !jobDescription || !jobRoleCategory) {
      setError("All fields are required");
      return false;
    }

    if (jobRoleCategory === "other" && !jobRoleCustom) {
      setError("Custom job role is required");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        job_title: jobTitle,
        job_role_category: jobRoleCategory,
        resume_text: resume,
        job_description_text: jobDescription,
      };

      if (jobRoleCategory === "other") {
        payload.job_role_custom = jobRoleCustom;
      }

      const result = await createJob(payload);

      navigate(`/results/${result.job_id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create analysis");
      }
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

            {/* Job Role Category */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Job Role Category
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={jobRoleCategory}
                onChange={(e) => setJobRoleCategory(e.target.value)}
              >
                <option value="">Select role</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.label} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Role */}
            {jobRoleCategory === "other" && (
              <TextField
                label="Custom Role"
                name="job_role_custom"
                value={jobRoleCustom}
                onChange={(e) => setJobRoleCustom(e.target.value)}
                placeholder="Enter custom role"
              />
            )}

            {/* Resume */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Resume</label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[140px]"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste resume"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Job Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[140px]"
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste job description"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Analyze"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}