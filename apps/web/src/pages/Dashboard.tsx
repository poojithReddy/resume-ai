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
  user_name?: string;
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
        setError(err instanceof Error ? err.message : "Failed to load jobs");
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

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  }

  function getBandBadge(band?: string) {
    if (!band) return "bg-gray-100 text-gray-600";

    if (band === "Excellent") return "bg-green-100 text-green-700";
    if (band === "Very Good") return "bg-blue-100 text-blue-700";
    if (band === "Good") return "bg-yellow-100 text-yellow-700";
    if (band === "Average") return "bg-orange-100 text-orange-700";

    return "bg-red-100 text-red-700";
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">

      <PageHeader
        title="Dashboard"
        subtitle={
          role === "ADMIN" || role === "SUPER_ADMIN"
            ? "All job analyses across users"
            : `Welcome back${user?.name ? `, ${user.name}` : ""}`
        }
        actions={
          <Link to="/create">
            <Button>Create Analysis</Button>
          </Link>
        }
      />

      {/* STATES */}
      {loading && <div className="text-sm text-text-secondary">Loading...</div>}

      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <Card padding="md">
          <div className="text-sm text-text-secondary text-center py-6">
            No analyses yet. Start by creating one.
          </div>
        </Card>
      )}

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 tablet:hidden">
        {paginatedJobs.map((job) => (
          <Card key={job.job_id} padding="md">

            <div className="space-y-3">

              <div className="flex justify-between items-start">
                <div className="font-semibold text-sm">
                  {job.job_title}
                </div>

                {job.score !== null && (
                  <span className={`text-sm font-semibold ${getScoreColor(job.score)}`}>
                    {job.score}%
                  </span>
                )}
              </div>

              {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                <div className="text-xs text-text-secondary">
                  User: {job.user_name || "-"}
                </div>
              )}

              <div className="flex justify-between text-xs text-text-secondary">
                <span>{new Date(job.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{job.status}</span>
              </div>

              {job.match_band && (
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getBandBadge(job.match_band)}`}>
                  {job.match_band}
                </span>
              )}

              <div className="pt-2">
                <Link to={`/results/${job.job_id}`}>
                  <Button variant="secondary" fullWidth>
                    View
                  </Button>
                </Link>
              </div>

            </div>

          </Card>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden tablet:block">
        {!loading && !error && jobs.length > 0 && (
          <Card padding="md">

            <div className="overflow-x-auto">

              <table className="w-full text-sm border border-gray-200">

                <thead className="bg-muted text-center">
                  <tr>
                    {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                      <th className="p-3 border">User</th>
                    )}
                    <th className="p-3 border">Job</th>
                    <th className="p-3 border">Created</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Score</th>
                    <th className="p-3 border">Band</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedJobs.map((job) => (
                    <tr key={job.job_id} className="text-center hover:bg-muted/40">
                      {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                        <td className="p-3 border">{job.user_name || "-"}</td>
                      )}

                      <td className="p-3 border font-medium">
                        {job.job_title}
                      </td>

                      <td className="p-3 border text-text-secondary">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-3 border capitalize">
                        {job.status}
                      </td>

                      <td className="p-3 border">
                        {job.score !== null ? (
                          <span className={`font-semibold ${getScoreColor(job.score)}`}>
                            {job.score}%
                          </span>
                        ) : "-"}
                      </td>

                      <td className="p-3 border">
                        {job.match_band ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${getBandBadge(job.match_band)}`}>
                            {job.match_band}
                          </span>
                        ) : "-"}
                      </td>

                      <td className="p-3 border">
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

          </Card>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {jobs.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          <div className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </div>

          <Button
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </Button>

        </div>
      )}

    </div>
  );
}