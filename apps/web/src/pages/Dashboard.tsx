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
      <div className="border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Start a demo run now. Upload and real AI scoring will be added next.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="border rounded px-4 py-2 bg-gray-900 text-white"
            onClick={() => navigate("/demo")}
          >
            Start Demo Run
          </button>

          <button
            className="border rounded px-4 py-2"
            onClick={() => alert("Upload flow coming next")}
          >
            New Analysis (Upload)
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold">New Analysis</h2>
        <p className="text-gray-600 mt-1">
          Next, we’ll build the upload form here for job details and multiple resumes.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="border rounded p-4">
            <div className="font-medium">Job details</div>
            <div className="text-sm text-gray-600 mt-1">
              Add a job title and paste the job description.
            </div>
          </div>

          <div className="border rounded p-4">
            <div className="font-medium">Resumes</div>
            <div className="text-sm text-gray-600 mt-1">
              Upload multiple resumes and score them against the role.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent runs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Demo history for now. Real saved runs from the backend come next.
            </p>
          </div>
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
              {demoRuns.map((run) => (
                <tr
                  key={run.jobId}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/results/${run.jobId}`)}
                >
                  <td className="p-3 font-medium">{run.jobTitle}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDate(run.createdAt)}
                  </td>
                  <td className="p-3">{run.totalResumes}</td>
                  <td className="p-3">{run.topScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}