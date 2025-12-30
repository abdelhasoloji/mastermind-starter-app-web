import { Job } from "@/services/jobsService";

export function JobResult({ job }: { job: Job }) {
  if (job.status === "failed") {
    return <pre>Erreur: {job.error}</pre>;
  }

  return (
    <pre>{JSON.stringify(job.result, null, 2)}</pre>
  );
}
