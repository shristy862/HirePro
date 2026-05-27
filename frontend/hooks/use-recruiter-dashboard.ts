"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRecruiterDashboard } from "@/lib/api/dashboard";
import { getErrorMessage } from "@/lib/utils/errors";
import type { RecruiterDashboardData } from "@/types/dashboard";

interface UseRecruiterDashboardResult {
  data: RecruiterDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecruiterDashboard(): UseRecruiterDashboardResult {
  const [data, setData] = useState<RecruiterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboard = await fetchRecruiterDashboard();
      setData(dashboard);
    } catch (err) {
      setError(getErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
