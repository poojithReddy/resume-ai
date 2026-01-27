import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "@resume-ai/ui";

export default function Demo() {
  const navigate = useNavigate();

  // keep it stable; if you later want, you can generate a random id
  const jobId = useMemo(() => "demo-job-1", []);

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Demo screening run</h1>
          <p className="text-gray-600 max-w-2xl">
            This is a guided demo using sample data. It shows how we score candidates,
            what matched, what’s missing, and the evidence behind each match.
          </p>
        </div>

        {/* What you’ll see */}
        <Card padding="lg" className="space-y-3">
          <div className="text-sm font-semibold">What you’ll see</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>A match score per resume (0–100)</li>
            <li>Matched vs missing skills</li>
            <li>Evidence snippets you can reference during review</li>
          </ul>
          <p className="text-sm text-gray-500">
            No upload yet — we’ll add that once backend + AI is connected.
          </p>
        </Card>

        {/* Actions */}
        <Card padding="lg" className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="font-semibold">Run the sample job</div>
            <div className="text-sm text-gray-600">
              Opens results for <span className="font-mono text-gray-800">{jobId}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/results/${jobId}`)}
            >
              Open demo results
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Back to landing
            </Button>
          </div>
        </Card>

        {/* Optional: small note */}
        <div className="text-xs text-gray-500">
          Tip: once backend is ready, this page becomes “Start a run” and triggers an API call
          instead of navigating directly.
        </div>
      </div>
    </div>
  );
}
