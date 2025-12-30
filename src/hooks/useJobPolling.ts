import { useQuery } from "@tanstack/react-query";
import { getJob, Job } from "@/services/jobsService";

export function useJobPolling(jobId?: string) {
  return useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (data) => {
      if (!data) return false;
      return data.status === "completed" || data.status === "failed"
        ? false
        : 2000;
    }
  });
}
