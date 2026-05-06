import { useState } from "react";
import { Link } from "react-router-dom";

function getBand(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  return "Poor";
}

function getBandColor(score: number) {
  if (score >= 85) return "text-green-600";
  if (score >= 75) return "text-emerald-600";
  if (score >= 65) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getBarColor(score: number) {
  if (score >= 85) return "bg-green-500";
  if (score >= 75) return "bg-emerald-500";
  if (score >= 65) return "bg-blue-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

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

  const [fieldErrors, setFieldErrors] = useState({
    jobTitle: "",
    resume: "",
    jobDescription: "",
  });

  function validate() {
    const errors = {
      jobTitle: jobTitle ? "" : "Job title is required",
      resume: resume ? "" : "Resume is required",
      jobDescription: jobDescription ? "" : "Job description is required",
    };

    setFieldErrors(errors);

    return !errors.jobTitle && !errors.resume && !errors.jobDescription;
  }

  function loadSample() {
    setJobTitle("Frontend Developer");

    setResume(`
Frontend Developer with 4 years of experience building responsive web applications using React, JavaScript, HTML, and CSS.

Experienced in working with REST APIs, state management, and version control using Git. Strong focus on performance optimization and user-friendly interfaces.

Collaborated with cross-functional teams to deliver scalable solutions.
    `);

    setJobDescription(`
We are looking for a Frontend Developer with experience in React and TypeScript.

The ideal candidate should have strong skills in CSS, API integration, and testing frameworks. Experience with Git and performance optimization is required.

You will work closely with designers and backend teams to build scalable applications.
    `);

    setResult(null);
    setFieldErrors({
      jobTitle: "",
      resume: "",
      jobDescription: "",
    });
  }

  function resetDemo() {
    setJobTitle("");
    setResume("");
    setJobDescription("");
    setResult(null);
    setFieldErrors({
      jobTitle: "",
      resume: "",
      jobDescription: "",
    });
  }

  function runDemo() {
    if (!validate()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const resumeWords = new Set(
        resume.toLowerCase().split(/\s+/).filter(Boolean)
      );
      const jdWords = new Set(
        jobDescription.toLowerCase().split(/\s+/).filter(Boolean)
      );

      const matched = [...resumeWords].filter((word) =>
        jdWords.has(word)
      );

      const missing = [...jdWords].filter(
        (word) => !resumeWords.has(word)
      );

      const score = Math.floor(
        (matched.length / Math.max(jdWords.size, 1)) * 100
      );

      setResult({
        score,
        matched: matched.slice(0, 8),
        missing: missing.slice(0, 8),
      });

      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">
            Try HireLens AI
          </h1>
          <p className="text-sm text-text-secondary">
            Compare a resume against a job description instantly
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* INPUT */}
          <div className="bg-card rounded-xl shadow-md p-6 space-y-5 order-2 lg:order-1">

            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Input</h2>

              <div className="flex gap-4">
                <button
                  onClick={loadSample}
                  className="text-sm text-primary hover:underline"
                >
                  Use sample
                </button>

                <button
                  onClick={resetDemo}
                  className="text-sm text-text-secondary hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Job Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Job Title
              </label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary ${
                  fieldErrors.jobTitle ? "border-red-400" : ""
                }`}
              />
              {fieldErrors.jobTitle && (
                <p className="text-xs text-red-600">
                  {fieldErrors.jobTitle}
                </p>
              )}
            </div>

            {/* Resume */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Resume
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 min-h-[120px] text-sm focus:ring-2 focus:ring-primary ${
                  fieldErrors.resume ? "border-red-400" : ""
                }`}
              />
              {fieldErrors.resume && (
                <p className="text-xs text-red-600">
                  {fieldErrors.resume}
                </p>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                className={`w-full border rounded-lg px-3 py-2 min-h-[120px] text-sm focus:ring-2 focus:ring-primary ${
                  fieldErrors.jobDescription ? "border-red-400" : ""
                }`}
              />
              {fieldErrors.jobDescription && (
                <p className="text-xs text-red-600">
                  {fieldErrors.jobDescription}
                </p>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={runDemo}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition"
            >
              {loading ? "Running analysis..." : "Run analysis"}
            </button>
          </div>

          {/* RESULT */}
          <div className="order-1 lg:order-2">

            {!result ? (
              <div className="bg-card rounded-xl shadow-md p-6 text-center text-text-secondary text-sm">
                Your analysis results will appear here
              </div>
            ) : (
              <div className="bg-card rounded-xl shadow-md p-6 space-y-6">

                {/* Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {result.score}%
                  </div>

                  <div className={`text-sm font-semibold ${getBandColor(result.score)}`}>
                    {getBand(result.score)}
                  </div>

                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getBarColor(result.score)}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                {/* Demo notice */}
                <div className="text-xs text-text-secondary bg-muted px-3 py-2 rounded-md text-center">
                  This demo uses a basic comparison. Sign in to see full AI-powered analysis.
                  <Link to="/login" className="ml-1 text-primary hover:underline">
                    Sign in
                  </Link>
                </div>

                {/* Matched */}
                <div>
                  <div className="font-semibold mb-2">
                    Matched Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matched.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <div className="font-semibold mb-2">
                    Missing Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}