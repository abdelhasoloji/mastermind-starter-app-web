import { useState } from "react";
import { createJob } from "@/services/jobsService";
import { useJobPolling } from "@/hooks/useJobPolling";
import { JobTrigger } from "@/components/AsyncJob/JobTrigger";
import { JobProgress } from "@/components/AsyncJob/JobProgress";
import { JobResult } from "@/components/AsyncJob/JobResult";

export default function AsyncJobPage() {
  const [jobId, setJobId] = useState<string | undefined>();

  const { data: job, isLoading } = useJobPolling(jobId);

  const start = async () => {
    const job = await createJob("DOCUMENT_ANALYSIS", {});
    setJobId(job.id);
  };

  return (
    <div>
      <h1>Async Job Demo</h1>

      {!jobId && (
        <JobTrigger onTrigger={start} />
      )}

      {isLoading && <p>Chargement...</p>}

      {job && (
        <>
          <JobProgress job={job} />
          {(job.status === "completed" || job.status === "failed") && (
            <JobResult job={job} />
          )}
        </>
      )}
    </div>
  );
}
