import { http } from "./http";

export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  progress?: number;
  result?: any;
  error?: string;
}

export async function createJob(type: string, payload: any): Promise<Job> {
  return http<Job>("/v1/jobs", {
    method: "POST",
    body: JSON.stringify({ type, payload })
  });
}

export async function getJob(id: string): Promise<Job> {
  return http<Job>(`/v1/jobs/${id}`);
}
