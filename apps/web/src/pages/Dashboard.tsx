import { useNavigate } from "react-router-dom";
import { demoRuns } from "@/lib/runs";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Upload a job description and resumes to get a match score + evidence.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="border rounded px-4 py-2 bg-gray-900 text-white"
            onClick={() => navigate("/demo")}
          >
            Try Demo Mode
          </button>

          <button
            className="border rounded px-4 py-2"
            onClick={() => alert("Upload flow coming next")}
          >
            New Analysis (Upload)
          </button>
        </div>
      </div>

      {/* Coming soon: upload */}
      <section className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold">New Analysis</h2>
        <p className="text-gray-600 mt-1">
          Next, we’ll build the upload form here (job requirements + multiple resumes).
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="border rounded p-4">
            <div className="font-medium">Job description</div>
            <div className="text-sm text-gray-600 mt-1">
              Paste text or upload a file (later).
            </div>
          </div>

          <div className="border rounded p-4">
            <div className="font-medium">Resumes</div>
            <div className="text-sm text-gray-600 mt-1">
              Upload multiple resumes; we’ll score each one.
            </div>
          </div>
        </div>
      </section>

      {/* Recent runs */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Recent runs</h2>
          <button
            className="text-sm underline"
            onClick={() => navigate("/results/demo-job-1")}
          >
            View latest
          </button>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Job</th>
                <th className="p-3">Created</th>
                <th className="p-3">Resumes</th>
                <th className="p-3">Top score</th>
              </tr>
            </thead>
            <tbody>
              {demoRuns.map((r) => (
                <tr
                  key={r.jobId}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/results/${r.jobId}`)}
                >
                  <td className="p-3 font-medium">{r.jobTitle}</td>
                  <td className="p-3 text-sm text-gray-600">{formatDate(r.createdAt)}</td>
                  <td className="p-3">{r.totalResumes}</td>
                  <td className="p-3">{r.topScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
