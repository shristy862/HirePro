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
  fetchMyApplications,
  fetchRecruiterApplications,
  filterApplications,
  mergeRecruiterApplication,
  updateApplicationStatus as updateApplicationStatusApi,
} from "@/lib/api/applications";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Application, ApplicationStatus } from "@/types/applications";

interface ApplicationsContextValue {
  applications: Application[];
  appliedJobIds: Set<string>;
  loading: boolean;
  error: string | null;
  isRecruiter: boolean;
  hasApplied: (jobId: string) => boolean;
  markApplied: (jobId: string) => void;
  loadApplications: () => Promise<void>;
  getFiltered: (params?: { search?: string; status?: string }) => Application[];
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => Promise<Application>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null
);

export function ApplicationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasRole, user, isLoading: authLoading } = useAuthContext();
  const isRecruiter = hasRole("recruiter");
  const isCandidate = hasRole("candidate");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    if (authLoading || !user) {
      setApplications([]);
      return;
    }

    if (!isRecruiter && !isCandidate) {
      setApplications([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = isRecruiter
        ? await fetchRecruiterApplications()
        : await fetchMyApplications();
      setApplications(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, user, isRecruiter, isCandidate]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId)),
    [applications]
  );

  const hasApplied = useCallback(
    (jobId: string) => appliedJobIds.has(jobId),
    [appliedJobIds]
  );

  const markApplied = useCallback((jobId: string) => {
    setApplications((prev) => {
      if (prev.some((a) => a.jobId === jobId)) return prev;
      return [
        {
          id: `local-${jobId}`,
          jobId,
          jobTitle: "",
          company: "",
          candidateName: "",
          candidateEmail: "",
          status: "pending",
          appliedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
    void loadApplications();
  }, [loadApplications]);

  const getFiltered = useCallback(
    (params?: { search?: string; status?: string }) =>
      filterApplications(applications, params),
    [applications]
  );

  const updateApplicationStatus = useCallback(
    async (applicationId: string, status: ApplicationStatus) => {
      if (!isRecruiter) {
        throw new Error("Only recruiters can update application status");
      }

      const updated = await updateApplicationStatusApi(
        applicationId,
        status
      );

      let merged = updated;

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          merged = mergeRecruiterApplication(app, updated);
          return merged;
        })
      );

      return merged;
    },
    [isRecruiter]
  );

  const value = useMemo(
    () => ({
      applications,
      appliedJobIds,
      loading: authLoading || loading,
      error,
      isRecruiter,
      hasApplied,
      markApplied,
      loadApplications,
      getFiltered,
      updateApplicationStatus,
    }),
    [
      applications,
      appliedJobIds,
      authLoading,
      loading,
      error,
      isRecruiter,
      hasApplied,
      markApplied,
      loadApplications,
      getFiltered,
      updateApplicationStatus,
    ]
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error("useApplications must be used within ApplicationsProvider");
  }
  return ctx;
}

export function useOptionalApplications() {
  return useContext(ApplicationsContext);
}
