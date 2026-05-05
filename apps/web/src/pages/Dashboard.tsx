import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, PageHeader, Button } from "@resume-ai/ui";

import { listJobs } from "@/lib/api";
import { getUserRole, getUserFromToken } from "@/lib/authUtil";

type Job = {
  job_id: string;
  job_title: string;
  status: string;
  created_at: string;
  score: number | null;
  match_band?: string;
  user_name?: string; // backend should return this for admin
};

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const role = getUserRole();
  const user = getUserFromToken();

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await listJobs();
        setJobs(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);

  const paginatedJobs = jobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={
          role === "ADMIN" || role === "SUPER_ADMIN"
            ? "Admin view - all job analyses"
            : `Welcome ${user?.name || ""}`
        }
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

      {!loading && !error && jobs.length > 0 && (
        <Card padding="md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <th className="p-2 border">User</th>
                  )}
                  <th className="p-2 border">Job Title</th>
                  <th className="p-2 border">Created</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border">Match Band</th>
                  <th className="p-2 border"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.job_id} className="border-t">
                    {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                      <td className="p-2 border">
                        {job.user_name || "-"}
                      </td>
                    )}

                    <td className="p-2 border font-medium">
                      {job.job_title}
                    </td>

                    <td className="p-2 border">
                      {new Date(job.created_at).toLocaleString()}
                    </td>

                    <td className="p-2 border capitalize">
                      {job.status}
                    </td>

                    <td className="p-2 border">
                      {job.score !== null ? (
                        <span
                          className={`font-semibold ${
                            job.score >= 80
                              ? "text-green-600"
                              : job.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {job.score}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-2 border">
                      {job.match_band || "-"}
                    </td>

                    <td className="p-2 border">
                      <Link to={`/results/${job.job_id}`}>
                        <Button variant="secondary">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <div className="text-sm">
              Page {page} of {totalPages}
            </div>

            <Button
              variant="ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}