import { supabase } from "@/shared/supabase/client";
import { env } from "@/shared/config/env";

export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  progress?: number;
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  documentId: string;
  type: "analysis" | "extraction" | "summary";
  options?: Record<string, unknown>;
}

export interface CreateJobResponse {
  id: string;
  status: JobStatus;
  createdAt: string;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error("Non authentifié");
  }
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.access_token}`,
  };
}

export async function createJob(request: CreateJobRequest): Promise<CreateJobResponse> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${env.apiBaseUrl}/v1/jobs`, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  
  return response.json();
}

export async function getJob(jobId: string): Promise<Job> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${env.apiBaseUrl}/v1/jobs/${jobId}`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  
  return response.json();
}
