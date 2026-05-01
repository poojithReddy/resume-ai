import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

import { getJob } from "@/lib/api";

type Scorecard = {
  score: number;
  match_band: string;
  summary: string;
  matched_points: string[];
  missing_points: string[];
};

type JobDetail = {
  job_id: string;
  job_title: string;
  status: string;
  resume_text: string;
  job_description_text: string;
  created_at: string;
  scorecard: Scorecard;
};

export default function Results() {
  const { jobId } = useParams();

  const [data, setData] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!jobId) {
          setError("Missing job id");
          return;
        }

        const result = await getJob(jobId);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load results");
        }
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
              {data.job_title}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(data.created_at).toLocaleString()}
            </div>

            <div className="mt-4 text-3xl font-bold">
              {data.scorecard.score}%
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
              {data.scorecard.matched_points.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <div className="font-semibold mb-2">Missing Keywords</div>
            <ul className="list-disc ml-5">
              {data.scorecard.missing_points.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <div className="font-semibold mb-2">Resume</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {data.resume_text}
            </div>
          </Card>

          <Card padding="md">
            <div className="font-semibold mb-2">Job Description</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {data.job_description_text}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}