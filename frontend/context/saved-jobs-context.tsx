"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthContext } from "@/context/auth-context";
import {
  fetchSavedJobIds,
  fetchSavedJobs,
  saveJobApi,
  unsaveJobApi,
} from "@/lib/api/saved-jobs";
import type { SavedJobEntry } from "@/lib/api/saved-jobs";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";

interface SavedJobsContextValue {
  savedIds: Set<string>;
  savedJobs: SavedJobEntry[];
  loading: boolean;
  togglingId: string | null;
  isSaved: (jobId: string) => boolean;
  toggleSave: (jobId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const SavedJobsContext = createContext<SavedJobsContextValue | null>(null);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { hasRole, user, isLoading: authLoading } = useAuthContext();
  const isCandidate = hasRole("candidate");

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<SavedJobEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadSaved = useCallback(async () => {
    if (authLoading || !isCandidate || !user) {
      setSavedIds(new Set());
      setSavedJobs([]);
      return;
    }

    setLoading(true);
    try {
      const entries = await fetchSavedJobs();
      setSavedJobs(entries);
      setSavedIds(new Set(entries.map((e) => e.job.id)));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSavedIds(new Set());
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isCandidate, user]);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  const toggleSave = useCallback(
    async (jobId: string) => {
      if (!isCandidate) return;

      const wasSaved = savedIds.has(jobId);

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(jobId);
        else next.add(jobId);
        return next;
      });

      setTogglingId(jobId);

      try {
        if (wasSaved) {
          await unsaveJobApi(jobId);
          setSavedJobs((prev) => prev.filter((e) => e.job.id !== jobId));
          toast.success("Removed from saved jobs");
        } else {
          await saveJobApi(jobId);
          toast.success("Job saved");
          void loadSaved();
        }
      } catch (error) {
        const message = getErrorMessage(error);

        if (!wasSaved && message.toLowerCase().includes("already saved")) {
          setSavedIds((prev) => new Set(prev).add(jobId));
          void loadSaved();
          return;
        }

        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });

        toast.error(message);
      } finally {
        setTogglingId(null);
      }
    },
    [isCandidate, savedIds, loadSaved]
  );

  const isSaved = useCallback(
    (jobId: string) => savedIds.has(jobId),
    [savedIds]
  );

  const value = useMemo(
    () => ({
      savedIds,
      savedJobs,
      loading: authLoading || (isCandidate && loading),
      togglingId,
      isSaved,
      toggleSave,
      refetch: loadSaved,
    }),
    [
      savedIds,
      savedJobs,
      authLoading,
      isCandidate,
      loading,
      togglingId,
      isSaved,
      toggleSave,
      loadSaved,
    ]
  );

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) {
    throw new Error("useSavedJobs must be used within SavedJobsProvider");
  }
  return ctx;
}

export function useOptionalSavedJobs() {
  return useContext(SavedJobsContext);
}
