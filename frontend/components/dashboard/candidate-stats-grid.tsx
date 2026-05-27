import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card";
import { buildCandidateDashboardStats } from "@/lib/utils/dashboard";
import type { CandidateDashboardData } from "@/types/dashboard";

interface CandidateStatsGridProps {
  data: CandidateDashboardData | null;
  loading: boolean;
}

export function CandidateStatsGrid({
  data,
  loading,
}: CandidateStatsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = buildCandidateDashboardStats(data);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
