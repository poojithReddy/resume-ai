import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJob, type JobDetailResponse } from "../lib/api";

export default function Results() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      if (!jobId) {
        setErrorMessage("Missing job id");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getJob(jobId);
        setJob(result);
      } catch {
        setErrorMessage(`No results found for jobId: ${jobId}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadJob();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-white">
          <h1 className="text-2xl font-bold">Results</h1>
          <p className="mt-2 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !job) {
    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-white">
          <h1 className="text-2xl font-bold">Results</h1>
          <p className="mt-2 text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="text-gray-600 mt-2">
          Job ID: <span className="font-mono">{job.job_id}</span>
        </p>
      </section>

      <section className="border rounded-lg p-6 bg-white space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Resume text</h2>
          <p className="text-gray-700 mt-2">{job.resume_text}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Job description</h2>
          <p className="text-gray-700 mt-2">{job.job_description_text}</p>
        </div>
      </section>
    </div>
  );
}