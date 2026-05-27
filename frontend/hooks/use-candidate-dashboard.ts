"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCandidateDashboard } from "@/lib/api/dashboard";
import { getErrorMessage } from "@/lib/utils/errors";
import type { CandidateDashboardData } from "@/types/dashboard";

interface UseCandidateDashboardResult {
  data: CandidateDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCandidateDashboard(): UseCandidateDashboardResult {
  const [data, setData] = useState<CandidateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboard = await fetchCandidateDashboard();
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
