"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilter } from "@/components/shared/search-filter";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/shared/empty-state";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { useDebounce } from "@/hooks/use-debounce";

export function CandidateJobsView() {
  const { loading, error, loadJobs, getFiltered } = useJobs();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const debouncedSearch = useDebounce(search);

  const openJobs = getFiltered({
    search: debouncedSearch || undefined,
    status: "open",
    employmentType: typeFilter,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Jobs"
        description="Explore open roles from hiring teams on HireFlow — updated live from recruiters."
      />

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by title, location, or skills..."
        filters={[
          {
            label: "Type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: "Full-time", value: "full-time" },
              { label: "Part-time", value: "part-time" },
              { label: "Internship", value: "internship" },
              { label: "Contract", value: "contract" },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={Briefcase}
          title="Could not load jobs"
          description={error}
          action={{ label: "Try again", onClick: () => loadJobs() }}
        />
      ) : openJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No open positions right now"
          description="Check back soon — recruiters publish new roles here every day."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {openJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="candidate" />
          ))}
        </div>
      )}
    </div>
  );
}
