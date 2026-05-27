import { DashboardSkeleton } from "@/components/shared/loading-skeleton";

export default function RecruiterLoading() {
  return (
    <div className="p-6 lg:p-8">
      <DashboardSkeleton />
    </div>
  );
}
