import { useState } from "react";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

export default function Demo() {
  const [jobTitle, setJobTitle] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<{
    score: number;
    matched: string[];
    missing: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function runDemo() {
    setLoading(true);

    setTimeout(() => {
      const resumeWords = new Set(
        resume.toLowerCase().split(/\s+/).filter(Boolean),
      );
      const jdWords = new Set(
        jobDescription.toLowerCase().split(/\s+/).filter(Boolean),
      );

      const matched = [...resumeWords].filter((word) =>
        jdWords.has(word),
      );
      const missing = [...jdWords].filter(
        (word) => !resumeWords.has(word),
      );

      const score = Math.floor(
        (matched.length / Math.max(jdWords.size, 1)) * 100,
      );

      setResult({
        score,
        matched: matched.slice(0, 5),
        missing: missing.slice(0, 5),
      });

      setLoading(false);
    }, 800);
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <Card padding="lg">
          <PageHeader
            title="Try Demo"
            subtitle="Run a quick analysis without logging in (demo mode)"
          />

          <div className="space-y-4 mt-4">
            <TextField
              label="Job Title"
              name="job_title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Frontend Developer"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Resume</label>
              <textarea
                className="w-full rounded border px-3 py-2 min-h-[140px]"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste resume text here..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Job Description
              </label>
              <textarea
                className="w-full rounded border px-3 py-2 min-h-[140px]"
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste job description here..."
              />
            </div>

            <Button onClick={runDemo} disabled={loading}>
              {loading ? "Running..." : "Run Demo"}
            </Button>
          </div>
        </Card>

        {result && (
          <Card padding="md">
            <div className="text-lg font-semibold">
              Score: {result.score}%
            </div>

            <div className="mt-4">
              <div className="font-semibold">Matched</div>
              <ul className="list-disc ml-5">
                {result.matched.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="font-semibold">Missing</div>
              <ul className="list-disc ml-5">
                {result.missing.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}