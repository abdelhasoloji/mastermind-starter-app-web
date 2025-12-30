import { Job } from "@/services/jobsService";

export function JobProgress({ job }: { job: Job }) {
  return (
    <div>
      <p>Status: {job.status}</p>
      {typeof job.progress === "number" && (
        <progress value={job.progress} max={100} />
      )}
    </div>
  );
}
