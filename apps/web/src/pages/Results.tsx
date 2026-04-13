import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

import { getJob } from "@/lib/api";

export default function Results() {
  const { jobId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!jobId) return;

        const result = await getJob(jobId);
        setData(result);
      } catch {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Analysis Result"
        subtitle="Match score and keyword insights"
        actions={
          <Link to="/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        }
      />

      {loading && <div>Loading...</div>}

      {error && <div className="text-red-600">{error}</div>}

      {data && (
        <div className="grid gap-4">
          <Card padding="md">
            <div className="text-lg font-semibold">
              Score: {data.scorecard.score}%
            </div>
            <div className="text-sm text-gray-500">
              {data.scorecard.match_band}
            </div>
            <div className="mt-2 text-sm">
              {data.scorecard.summary}
            </div>
          </Card>

          <Card padding="md">
            <div className="font-semibold mb-2">Matched Keywords</div>
            <ul className="list-disc ml-5">
              {data.scorecard.matched_points.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <div className="font-semibold mb-2">Missing Keywords</div>
            <ul className="list-disc ml-5">
              {data.scorecard.missing_points.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}