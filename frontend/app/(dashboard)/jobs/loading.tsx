import { JobCardSkeleton } from "@/components/shared/loading-skeleton";

export default function JobsLoading() {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 lg:p-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
