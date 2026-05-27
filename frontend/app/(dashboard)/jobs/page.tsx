"use client";

import { useAuthContext } from "@/context/auth-context";
import { RecruiterJobsView } from "@/components/jobs/recruiter-jobs-view";
import { CandidateJobsView } from "@/components/jobs/candidate-jobs-view";

export default function JobsPage() {
  const { hasRole } = useAuthContext();

  if (hasRole("recruiter")) {
    return <RecruiterJobsView />;
  }

  return <CandidateJobsView />;
}
