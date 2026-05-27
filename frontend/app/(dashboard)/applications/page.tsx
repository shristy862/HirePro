"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilter } from "@/components/shared/search-filter";
import { RecruiterApplicationsView } from "@/components/applications/recruiter-applications-view";
import { CandidateApplicationsList } from "@/components/applications/candidate-applications-list";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/use-applications";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { APPLICATION_STATUS_FILTER_OPTIONS } from "@/constants/applications";

export default function ApplicationsPage() {
  const { hasRole } = useAuthContext();
  const isRecruiter = hasRole("recruiter");
  const { loading, error, loadApplications, getFiltered } = useApplications();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(search);

  const applications = getFiltered({
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={isRecruiter ? "Applications" : "My Applications"}
        description={
          isRecruiter
            ? "Review and manage candidate applications across your job postings"
            : "Track jobs you applied to and your current status"
        }
      >
        {!isRecruiter && (
          <Button variant="outline" asChild>
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        )}
      </PageHeader>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder={
          isRecruiter
            ? "Search candidates or positions..."
            : "Search by job or company..."
        }
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: APPLICATION_STATUS_FILTER_OPTIONS,
          },
        ]}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <EmptyState
          icon={FileText}
          title="Could not load applications"
          description={error}
          action={{ label: "Try again", onClick: () => loadApplications() }}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description={
            isRecruiter
              ? "Applications will appear here when candidates apply to your open roles."
              : "You haven't applied to any jobs yet. Browse openings and submit your first application."
          }
          action={
            !isRecruiter
              ? { label: "Browse jobs", href: "/jobs" }
              : undefined
          }
        />
      ) : isRecruiter ? (
        <RecruiterApplicationsView applications={applications} />
      ) : (
        <CandidateApplicationsList applications={applications} />
      )}

      {!loading && !error && applications.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing {applications.length} application
          {applications.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
