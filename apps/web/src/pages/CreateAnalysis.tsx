import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

import { createJob } from "@/lib/api";
import toast from "react-hot-toast";

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

  const [errors, setErrors] = useState<any>({});

  function validate() {
    const newErrors: any = {};

    if (!jobTitle) newErrors.jobTitle = "Required";
    if (!jobRoleCategory) newErrors.role = "Required";
    if (!resume) newErrors.resume = "Required";
    if (!jobDescription) newErrors.jd = "Required";

    if (jobRoleCategory === "other" && !jobRoleCustom) {
      newErrors.customRole = "Required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setJobTitle("");
    setJobRoleCategory("");
    setJobRoleCustom("");
    setResume("");
    setJobDescription("");
    setErrors({});
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);

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

      toast.success("Analysis created");

      navigate(`/results/${result.job_id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create analysis"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 tablet:p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">

        <PageHeader
          title="Create Analysis"
          subtitle="Compare a resume against a job description"
        />

        <Card padding="lg">

          <div className="space-y-6">

            {/* BASIC INFO */}
            <div className="space-y-4">

              <InputField
                label="Job Title"
                value={jobTitle}
                onChange={setJobTitle}
                error={errors.jobTitle}
              />

              <SelectField
                label="Job Role Category"
                value={jobRoleCategory}
                onChange={setJobRoleCategory}
                options={ROLE_OPTIONS}
                error={errors.role}
              />

              {jobRoleCategory === "other" && (
                <InputField
                  label="Custom Role"
                  value={jobRoleCustom}
                  onChange={setJobRoleCustom}
                  error={errors.customRole}
                />
              )}

            </div>

            {/* TEXT AREAS */}
            <div className="space-y-4">

              <TextAreaField
                label="Resume"
                value={resume}
                onChange={setResume}
                error={errors.resume}
                placeholder="Paste resume text here..."
              />

              <TextAreaField
                label="Job Description"
                value={jobDescription}
                onChange={setJobDescription}
                error={errors.jd}
                placeholder="Paste job description..."
              />

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Run Analysis"}
              </button>

              <button
                onClick={resetForm}
                className="px-4 py-2.5 rounded-lg border text-sm hover:bg-gray-100 transition"
              >
                Reset
              </button>

            </div>

          </div>

        </Card>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function InputField({ label, value, onChange, error }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      />
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}

/* ---------------- SELECT ---------------- */

function SelectField({ label, value, onChange, options, error }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      >
        <option value="">Select role</option>
        {options.map((opt: any) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}

/* ---------------- TEXTAREA ---------------- */

function TextAreaField({ label, value, onChange, error, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2.5 text-sm min-h-[140px] focus:ring-2 focus:ring-primary"
      />
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}