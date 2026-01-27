import { useParams } from "react-router-dom";
import { useState } from "react";
import { demoJobRunResult } from "@resume-ai/shared";
import type { CandidateResult } from "@resume-ai/shared";
import { CandidateDetailDrawer } from "@resume-ai/ui";
export default function Results() {
  const { jobId } = useParams<{ jobId: string }>();
  const [selected, setSelected] = useState<CandidateResult | null>(null);
  // For now: only demo job supported
  const data = jobId === "demo-job-1" ? demoJobRunResult : null;

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="mt-2 text-red-600">
          No results found for jobId: <span className="font-mono">{jobId}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="text-gray-600 mt-1">
          Job ID: <span className="font-mono">{data.jobId}</span>
        </p>
      </div>

      <div className="border rounded p-4">
        <div className="flex gap-6 flex-wrap">
          <div>
            <div className="text-sm text-gray-600">Total resumes</div>
            <div className="text-xl font-semibold">{data.summary.total}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Top score</div>
            <div className="text-xl font-semibold">{data.summary.topScore}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Average score</div>
            <div className="text-xl font-semibold">{data.summary.avgScore}</div>
          </div>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Candidate</th>
              <th className="p-3">Score</th>
              <th className="p-3">Matched</th>
              <th className="p-3">Missing</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r) => (
              <tr
                    key={r.candidateId}
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                <td className="p-3 font-medium">{r.fileName}</td>
                <td className="p-3">{r.score}</td>
                <td className="p-3">{r.matched.join(", ")}</td>
                <td className="p-3">{r.missing.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CandidateDetailDrawer
        open={selected !== null}
        candidate={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
