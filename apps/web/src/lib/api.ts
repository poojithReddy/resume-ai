const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (data?.error?.message) {
      return data.error.message;
    }

    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      return data.detail[0]?.msg ?? "Request failed";
    }

    if (typeof data?.detail === "string") {
      return data.detail;
    }
  } catch {
    return "Request failed";
  }

  return "Request failed";
}

export type Scorecard = {
  score: number;
  match_band: string;
  summary: string;
  matched_points: string[];
  missing_points: string[];
};

export type Job = {
  job_id: string;
  job_title: string;
  status: string;
  created_at: string;
  score: number | null;
};

export type JobDetailResponse = {
  job_id: string;
  job_title: string;
  status: string;
  resume_text: string;
  job_description_text: string;
  created_at: string;
  scorecard: Scorecard;
};

export type CreateJobRequest = {
  job_title: string;
  resume_text: string;
  job_description_text: string;
};

export type CreateJobResponse = {
  job_id: string;
};

export async function listJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function getJob(jobId: string): Promise<JobDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function createJob(
  payload: CreateJobRequest,
): Promise<CreateJobResponse> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}