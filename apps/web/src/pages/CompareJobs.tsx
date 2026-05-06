import { useState } from "react";
import { Card, PageHeader } from "@resume-ai/ui";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function CompareJobs() {
  const [jobId1, setJobId1] = useState("");
  const [jobId2, setJobId2] = useState("");
  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  function validate() {
    const e: any = {};
    if (!jobId1) e.jobId1 = "Required";
    if (!jobId2) e.jobId2 = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCompare() {
    if (!validate()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await apiClient.get(
        `/admin/compare?job_id_1=${jobId1}&job_id_2=${jobId2}`
      );
      setResult(data);
    } catch (err) {
      toast.error("Compare failed");
    } finally {
      setLoading(false);
    }
  }

  function getBandStyle(band: string) {
    if (band === "Excellent") return "bg-green-100 text-green-700";
    if (band === "Very Good") return "bg-blue-100 text-blue-700";
    if (band === "Good") return "bg-yellow-100 text-yellow-700";
    if (band === "Average") return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  }

  /* ---------- DIFF LOGIC ---------- */
  function getDiff(a: string[], b: string[]) {
    const setA = new Set(a);
    const setB = new Set(b);

    const shared = a.filter((x) => setB.has(x));
    const uniqueA = a.filter((x) => !setB.has(x));
    const uniqueB = b.filter((x) => !setA.has(x));

    return { shared, uniqueA, uniqueB };
  }

  function getScoreDiff(a: number, b: number) {
    const diff = Math.abs(a - b);
    return diff;
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">

      <PageHeader
        title="Compare Candidates"
        subtitle="Understand who fits better and why"
      />

      {/* INPUT */}
      <Card padding="lg">
        <div className="space-y-4">

          <InputField
            label="Job ID A"
            value={jobId1}
            onChange={setJobId1}
            error={errors.jobId1}
          />

          <InputField
            label="Job ID B"
            value={jobId2}
            onChange={setJobId2}
            error={errors.jobId2}
          />

          <button
            onClick={handleCompare}
            className="w-full bg-primary text-white py-2.5 rounded-lg text-sm"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>

        </div>
      </Card>

      {/* RESULT */}
      {result && (
        <>
          {/* SCORE COMPARISON */}
          <Card padding="lg">
            <div className="text-center space-y-2">

              <div className="text-sm text-text-secondary">
                Score Comparison
              </div>

              <div className="flex justify-center items-center gap-6">

                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {result.user_a.score}%
                  </div>
                  <div className="text-xs">Candidate A</div>
                </div>

                <div className="text-sm font-semibold text-primary">
                  +{getScoreDiff(result.user_a.score, result.user_b.score)}%
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {result.user_b.score}%
                  </div>
                  <div className="text-xs">Candidate B</div>
                </div>

              </div>

              <div className="text-sm mt-2">
                Winner:{" "}
                <span className="font-semibold text-primary">
                  {result.winner === "user_a"
                    ? "Candidate A"
                    : "Candidate B"}
                </span>
              </div>

            </div>
          </Card>

          {/* SIDE BY SIDE */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">

            <CompareCard
              title="Candidate A"
              data={result.user_a}
              highlight={result.winner === "user_a"}
              getBandStyle={getBandStyle}
            />

            <CompareCard
              title="Candidate B"
              data={result.user_b}
              highlight={result.winner === "user_b"}
              getBandStyle={getBandStyle}
            />

          </div>

          {/* SKILL DIFF */}
          {(() => {
            const diff = getDiff(
              result.user_a.matched_points,
              result.user_b.matched_points
            );

            return (
              <Card padding="lg">
                <div className="space-y-4">

                  <div className="font-semibold">
                    Skill Comparison
                  </div>

                  {/* SHARED */}
                  <div>
                    <div className="text-xs mb-2 text-text-secondary">
                      Shared Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {diff.shared.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* UNIQUE */}
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">

                    <div>
                      <div className="text-xs mb-2 text-green-600">
                        Only Candidate A
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {diff.uniqueA.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs mb-2 text-blue-600">
                        Only Candidate B
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {diff.uniqueB.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </Card>
            );
          })()}
        </>
      )}
    </div>
  );
}

/* ---------------- CARD ---------------- */

function CompareCard({ title, data, highlight, getBandStyle }: any) {
  return (
    <Card padding="md" className={highlight ? "ring-2 ring-primary" : ""}>
      <div className="space-y-3">

        <div className="flex justify-between items-center">
          <div className="font-semibold">{title}</div>

          <span className={`text-xs px-2 py-1 rounded ${getBandStyle(data.match_band)}`}>
            {data.match_band}
          </span>
        </div>

        <div className="text-3xl font-bold">
          {data.score}%
        </div>

        <div className="text-sm text-text-secondary">
          {data.summary}
        </div>

      </div>
    </Card>
  );
}

/* INPUT */
function InputField({ label, value, onChange, error }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      />
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}