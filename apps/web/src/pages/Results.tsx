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

  const [showResume, setShowResume] = useState(false);
  const [showJD, setShowJD] = useState(false);

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
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  function getBandStyle(band: string) {
    switch (band) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Very Good":
        return "bg-blue-100 text-blue-700";
      case "Good":
        return "bg-yellow-100 text-yellow-700";
      case "Average":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-red-100 text-red-700";
    }
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">

      <PageHeader
        title="Analysis Result"
        subtitle="See how well the candidate matches the role"
        actions={
          <Link to="/dashboard">
            <Button variant="secondary">Back</Button>
          </Link>
        }
      />

      {loading && <div className="text-sm text-text-secondary">Loading...</div>}

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {data && (
        <div className="space-y-6">

          {/* SCORECARD */}
          <Card padding="lg">
            <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">

              <div>
                <div className="text-lg font-semibold">
                  {data.job_title}
                </div>

                <div className="text-xs text-text-secondary">
                  {new Date(data.created_at).toLocaleString()}
                </div>
              </div>

              <div className="text-center tablet:text-right">
                <div className="text-4xl font-bold">
                  {data.scorecard.score}%
                </div>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getBandStyle(
                    data.scorecard.match_band
                  )}`}
                >
                  {data.scorecard.match_band}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-text-secondary leading-relaxed">
              {data.scorecard.summary}
            </div>
          </Card>

          {/* KEYWORDS */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">

            {/* MATCHED */}
            <Card padding="md">
              <div className="font-semibold mb-3">
                Matched Skills
              </div>

              <div className="flex flex-wrap gap-2">
                {data.scorecard.matched_points.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>

            {/* MISSING */}
            <Card padding="md">
              <div className="font-semibold mb-3">
                Missing Skills
              </div>

              <div className="flex flex-wrap gap-2">
                {data.scorecard.missing_points.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>

          </div>

          {/* RESUME */}
          <Card padding="md">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Resume</div>

              <button
                onClick={() => setShowResume(!showResume)}
                className="text-xs text-primary"
              >
                {showResume ? "Hide" : "View"}
              </button>
            </div>

            {showResume && (
              <div className="text-sm text-text-secondary whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                {data.resume_text}
              </div>
            )}
          </Card>

          {/* JOB DESCRIPTION */}
          <Card padding="md">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Job Description</div>

              <button
                onClick={() => setShowJD(!showJD)}
                className="text-xs text-primary"
              >
                {showJD ? "Hide" : "View"}
              </button>
            </div>

            {showJD && (
              <div className="text-sm text-text-secondary whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                {data.job_description_text}
              </div>
            )}
          </Card>

        </div>
      )}
    </div>
  );
}