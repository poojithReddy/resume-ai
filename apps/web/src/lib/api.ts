import { apiClient } from "./apiClient";

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
  job_role_category?: string;
  job_role_custom?: string;
  status: string;
  created_at: string;
  score: number | null;
  match_band?: string;
};

export type JobDetailResponse = {
  job_id: string;
  job_title: string;
  job_role_category?: string;
  job_role_custom?: string;
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
  job_role_category: string;
  job_role_custom?: string;
};

export type CreateJobResponse = {
  job_id: string;
};

export async function listJobs(): Promise<Job[]> {
  return apiClient.get("/jobs");
}

export async function getJob(jobId: string): Promise<JobDetailResponse> {
  return apiClient.get(`/jobs/${jobId}`);
}

export async function createJob(
  payload: CreateJobRequest,
): Promise<CreateJobResponse> {
  return apiClient.post("/jobs", payload);
}