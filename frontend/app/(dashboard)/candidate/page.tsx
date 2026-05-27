"use client";

import Link from "next/link";
import { Bookmark, FileText, Search, Sparkles } from "lucide-react";
import { withRole } from "@/components/auth/with-role";
import { PageHeader } from "@/components/shared/page-header";
import { CandidateStatsGrid } from "@/components/dashboard/candidate-stats-grid";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { CandidateApplicationsList } from "@/components/applications/candidate-applications-list";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileCompletionProgress } from "@/components/profile/profile-completion-progress";
import { useCandidateDashboard } from "@/hooks/use-candidate-dashboard";
import { CANDIDATE_DASHBOARD_LINKS } from "@/constants/candidate-dashboard";
import { toProfileCompletionFromPercentage } from "@/lib/utils/dashboard";

function CandidateDashboardPage() {
  const { data, loading, error, refetch } = useCandidateDashboard();

  const profileCompletion = data
    ? toProfileCompletionFromPercentage(data.profileCompletion)
    : null;

  const recommendedJobs = data?.recommendedJobs ?? [];
  const recentApplications = data?.recentApplications ?? [];
  const savedJobsPreview = data?.savedJobsPreview ?? [];

  return (
    <div className="space-y-8">
      {error && !loading && (
        <EmptyState
          icon={FileText}
          title="Could not load dashboard"
          description={error}
          action={{
            label: "Retry",
            onClick: () => void refetch(),
          }}
          className="py-8"
        />
      )}

      {!error && profileCompletion && (
        <ProfileCompletionProgress completion={profileCompletion} />
      )}

      <PageHeader
        title="Candidate Dashboard"
        description="Your applications, saved roles, and new openings"
      >
        <Button asChild variant="outline">
          <Link href={CANDIDATE_DASHBOARD_LINKS.jobs}>
            <Search className="mr-2 size-4" />
            Browse all jobs
          </Link>
        </Button>
      </PageHeader>

      <CandidateStatsGrid data={data} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection
          title="My applications"
          description="Recent submissions and status"
          icon={FileText}
          viewAllHref={CANDIDATE_DASHBOARD_LINKS.applications}
        >
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Apply to roles that match your skills."
              action={{
                label: "Browse jobs",
                href: CANDIDATE_DASHBOARD_LINKS.jobs,
              }}
              className="py-8"
            />
          ) : (
            <CandidateApplicationsList
              applications={recentApplications}
              compact
            />
          )}
        </DashboardSection>

        <DashboardSection
          title="Saved jobs"
          description="Bookmarked for later"
          icon={Bookmark}
          viewAllHref={CANDIDATE_DASHBOARD_LINKS.savedJobs}
        >
          {loading ? (
            <div className="grid gap-4">
              <JobCardSkeleton />
            </div>
          ) : savedJobsPreview.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved jobs"
              description="Use the bookmark icon on job cards to save roles here."
              action={{
                label: "Browse jobs",
                href: CANDIDATE_DASHBOARD_LINKS.jobs,
              }}
              className="py-8"
            />
          ) : (
            <div className="grid gap-4">
              {savedJobsPreview.map(({ job }) => (
                <JobCard key={job.id} job={job} variant="candidate" />
              ))}
            </div>
          )}
        </DashboardSection>
      </div>

      <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-violet-600" />
            Recommended for you
          </CardTitle>
          <CardDescription>
            {loading
              ? "Loading openings…"
              : recommendedJobs.length > 0
                ? `${recommendedJobs.length} open position${recommendedJobs.length === 1 ? "" : "s"} from our latest listings`
                : "No open positions right now. Check back soon."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : recommendedJobs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No jobs posted yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="candidate" />
              ))}
            </div>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href={CANDIDATE_DASHBOARD_LINKS.jobs}>
              View all jobs
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default withRole(CandidateDashboardPage, {
  allowedRoles: ["candidate"],
});
