import type { EmploymentType, Job } from "@/types/jobs";

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEmploymentType(type: EmploymentType): string {
  const labels: Record<EmploymentType, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    internship: "Internship",
    contract: "Contract",
  };
  return labels[type] ?? type;
}

export function formatJobDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function filterJobs(
  jobs: Job[],
  params?: {
    search?: string;
    status?: string;
    employmentType?: string;
  }
): Job[] {
  let result = [...jobs];

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q)) ||
        j.createdBy?.name.toLowerCase().includes(q)
    );
  }

  if (params?.status && params.status !== "all") {
    result = result.filter((j) => j.status === params.status);
  }

  if (params?.employmentType && params.employmentType !== "all") {
    result = result.filter((j) => j.employmentType === params.employmentType);
  }

  return result;
}
