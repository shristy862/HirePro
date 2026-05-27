import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card";
import { buildRecruiterDashboardStats } from "@/lib/utils/dashboard";
import type { RecruiterDashboardData } from "@/types/dashboard";

interface RecruiterStatsGridProps {
  data: RecruiterDashboardData | null;
  loading: boolean;
}

export function RecruiterStatsGrid({ data, loading }: RecruiterStatsGridProps) {
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

  const stats = buildRecruiterDashboardStats(data);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
