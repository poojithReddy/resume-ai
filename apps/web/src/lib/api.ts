const apiBaseUrl = "http://127.0.0.1:8000/api/v1";

export type CreateJobRequest = {
  resume_text: string;
  job_description_text: string;
};

export type CreateJobResponse = {
  job_id: string;
};

export async function createJob(
  payload: CreateJobRequest,
): Promise<CreateJobResponse> {
  const response = await fetch(`${apiBaseUrl}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create job");
  }

  return response.json();
}

export type JobDetailResponse = {
  job_id: string;
  resume_text: string;
  job_description_text: string;
};

export async function getJob(jobId: string): Promise<JobDetailResponse> {
  const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to load job");
  }

  return response.json();
}