"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  closeJob,
  createJob,
  deleteJob,
  fetchJobs,
  updateJob,
} from "@/lib/api/jobs";
import { filterJobs } from "@/lib/utils/format-job";
import { getErrorMessage } from "@/lib/utils/errors";
import type { CreateJobPayload, Job, UpdateJobPayload } from "@/types/jobs";

interface UseJobsOptions {
  autoFetch?: boolean;
}

export function useJobs(options: UseJobsOptions = { autoFetch: true }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoFetch) {
      loadJobs();
    }
  }, [loadJobs, options.autoFetch]);

  const getFiltered = useCallback(
    (params?: {
      search?: string;
      status?: string;
      employmentType?: string;
    }) => filterJobs(jobs, params),
    [jobs]
  );

  const handleCreate = useCallback(
    async (payload: CreateJobPayload) => {
      const job = await createJob(payload);
      setJobs((prev) => [job, ...prev]);
      toast.success("Job posted successfully");
      return job;
    },
    []
  );

  const handleUpdate = useCallback(
    async (id: string, payload: UpdateJobPayload) => {
      const updated = await updateJob(id, payload);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      toast.success("Job updated successfully");
      return updated;
    },
    []
  );

  const handleDelete = useCallback(async (id: string) => {
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Job deleted successfully");
  }, []);

  const handleClose = useCallback(
    async (id: string) => {
      const updated = await closeJob(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      toast.success("Job marked as closed");
      return updated;
    },
    []
  );

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === "open").length,
    closed: jobs.filter((j) => j.status === "closed").length,
  };

  return {
    jobs,
    loading,
    error,
    stats,
    loadJobs,
    getFiltered,
    createJob: handleCreate,
    updateJob: handleUpdate,
    deleteJob: handleDelete,
    closeJob: handleClose,
  };
}
