import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, PageHeader, Button } from "@resume-ai/ui";

import { listJobs } from "@/lib/api";
import type { Job } from "@/lib/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await listJobs();
        setJobs(data);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your saved job analyses"
        actions={
          <Link to="/create">
            <Button>Create Analysis</Button>
          </Link>
        }
      />

      {loading && <div>Loading...</div>}

      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <div>No jobs yet. Create your first analysis.</div>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.job_id} padding="md">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{job.job_title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(job.created_at).toLocaleString()}
                </div>
              </div>

              <Link to={`/results/${job.job_id}`}>
                <Button variant="secondary">View</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}