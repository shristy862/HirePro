"use client";

import Link from "next/link";
import { Bookmark, RefreshCw } from "lucide-react";
import { withRole } from "@/components/auth/with-role";
import { PageHeader } from "@/components/shared/page-header";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/shared/empty-state";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSavedJobs } from "@/context/saved-jobs-context";

function SavedJobsPage() {
  const { savedJobs, loading, refetch } = useSavedJobs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved jobs"
        description="Roles you bookmarked — apply when you're ready"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => void refetch()}
            disabled={loading}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/jobs">Browse more jobs</Link>
          </Button>
        </div>
      </PageHeader>

      {!loading && savedJobs.length > 0 && (
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Bookmark className="size-8 shrink-0 fill-violet-600 text-violet-600" />
            <div>
              <p className="font-semibold">
                {savedJobs.length} saved job{savedJobs.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-muted-foreground">
                Tap the bookmark on any listing to add or remove from this list.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Tap the bookmark icon on any job listing to save it here for later."
          action={{ label: "Browse jobs", href: "/jobs" }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map(({ job }) => (
            <JobCard key={job.id} job={job} variant="candidate" />
          ))}
        </div>
      )}
    </div>
  );
}

export default withRole(SavedJobsPage, {
  allowedRoles: ["candidate"],
});
