import { useState } from "react";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { apiClient } from "@/lib/apiClient";

type CompareResult = {
  job_role_category: string;
  user_a: {
    job_id: string;
    score: number;
    match_band: string;
    summary: string;
    matched_points: string[];
    missing_points: string[];
  };
  user_b: {
    job_id: string;
    score: number;
    match_band: string;
    summary: string;
    matched_points: string[];
    missing_points: string[];
  };
  winner: string;
};

export default function CompareJobs() {
  const [jobId1, setJobId1] = useState("");
  const [jobId2, setJobId2] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCompare() {
    if (!jobId1 || !jobId2) {
      setError("Both job IDs are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient.get(
        `/admin/compare?job_id_1=${jobId1}&job_id_2=${jobId2}`
      );
      setResult(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Compare failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Compare Jobs"
        subtitle="Compare two job analyses"
      />

      <Card padding="lg">
        <div className="space-y-4">
          <TextField
            label="Job ID 1"
            name="jobId1"
            value={jobId1}
            onChange={(e) => setJobId1(e.target.value)}
          />

          <TextField
            label="Job ID 2"
            name="jobId2"
            value={jobId2}
            onChange={(e) => setJobId2(e.target.value)}
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button onClick={handleCompare} disabled={loading}>
            {loading ? "Comparing..." : "Compare"}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card padding="md">
            <div className="font-semibold">User A</div>
            <div>Score: {result.user_a.score}%</div>
            <div>{result.user_a.match_band}</div>
            <div className="text-sm mt-2">{result.user_a.summary}</div>
          </Card>

          <Card padding="md">
            <div className="font-semibold">User B</div>
            <div>Score: {result.user_b.score}%</div>
            <div>{result.user_b.match_band}</div>
            <div className="text-sm mt-2">{result.user_b.summary}</div>
          </Card>

          <Card padding="md" className="md:col-span-2 text-center">
            <div className="font-semibold">
              Winner: {result.winner}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}