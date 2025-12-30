import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, getJob, CreateJobRequest, Job, JobStatus } from "@/services/jobsService";
import { useState, useCallback, useEffect } from "react";

interface UseJobPollingOptions {
  pollingInterval?: number;
  onSuccess?: (job: Job) => void;
  onError?: (error: Error) => void;
}

interface UseJobPollingReturn {
  job: Job | null;
  status: JobStatus | "idle";
  isPolling: boolean;
  progress: number;
  error: Error | null;
  startJob: (request: CreateJobRequest) => Promise<void>;
  reset: () => void;
}

export function useJobPolling(options: UseJobPollingOptions = {}): UseJobPollingReturn {
  const { 
    pollingInterval = 2000, 
    onSuccess, 
    onError 
  } = options;
  
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Query pour polling du job
  const { 
    data: job, 
    error: pollError,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId && isPolling,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Arrêter le polling si terminé ou en erreur
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return pollingInterval;
    },
    retry: 2,
  });

  // Mutation pour créer un job
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      setJobId(data.id);
      setIsPolling(true);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Gérer la fin du job
  useEffect(() => {
    if (job?.status === "completed") {
      setIsPolling(false);
      onSuccess?.(job);
    } else if (job?.status === "failed") {
      setIsPolling(false);
      onError?.(new Error(job.error || "Le job a échoué"));
    }
  }, [job?.status, job, onSuccess, onError]);

  const startJob = useCallback(async (request: CreateJobRequest) => {
    setJobId(null);
    setIsPolling(false);
    await createJobMutation.mutateAsync(request);
  }, [createJobMutation]);

  const reset = useCallback(() => {
    setJobId(null);
    setIsPolling(false);
    queryClient.removeQueries({ queryKey: ["job", jobId] });
  }, [jobId, queryClient]);

  // Déterminer le statut global
  const status: JobStatus | "idle" = job?.status || (createJobMutation.isPending ? "pending" : "idle");
  
  // Erreur combinée
  const error = createJobMutation.error || pollError || null;

  return {
    job: job || null,
    status,
    isPolling,
    progress: job?.progress ?? 0,
    error: error as Error | null,
    startJob,
    reset,
  };
}
