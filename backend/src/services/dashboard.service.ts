import Application, {
  type IApplication,
} from "../models/application";
import SavedJob from "../models/SavedJob";
import Job from "../models/jobs";
import User from "../models/user";

const PROFILE_COMPLETION_FIELDS = [
  "name",
  "email",
  "bio",
  "skills",
  "experience",
  "education",
  "resume",
  "linkedin",
  "github",
  "portfolio",
] as const;

export const getCandidateDashboardService = async (
  userId: string
) => {
  const applicantFilter = { applicant: userId };

  const [
    totalApplications,
    savedJobs,
    pendingApplications,
    reviewedApplications,
    shortlistedApplications,
    rejectedApplications,
    recentApplications,
    recommendedJobs,
    savedJobsPreview,
    user,
  ] = await Promise.all([
    Application.countDocuments(applicantFilter),
    SavedJob.countDocuments({ user: userId }),
    Application.countDocuments({
      ...applicantFilter,
      status: "pending",
    }),
    Application.countDocuments({
      ...applicantFilter,
      status: "reviewed",
    }),
    Application.countDocuments({
      ...applicantFilter,
      status: "shortlisted",
    }),
    Application.countDocuments({
      ...applicantFilter,
      status: "rejected",
    }),
    Application.find(applicantFilter)
      .populate("job")
      .sort({ createdAt: -1 })
      .limit(5),
    Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(6),
    SavedJob.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 })
      .limit(2),
    User.findById(userId),
  ]);

  let completedFields = 0;

  const fieldValues: (unknown)[] = [
    user?.name,
    user?.email,
    user?.bio,
    user?.skills?.length,
    user?.experience,
    user?.education,
    user?.resume,
    user?.linkedin,
    user?.github,
    user?.portfolio,
  ];

  fieldValues.forEach((field) => {
    if (field) completedFields++;
  });

  const profileCompletion = Math.round(
    (completedFields / PROFILE_COMPLETION_FIELDS.length) * 100
  );

  return {
    totalApplications,
    savedJobs,
    applicationStats: {
      pending: pendingApplications,
      reviewed: reviewedApplications,
      shortlisted: shortlistedApplications,
      rejected: rejectedApplications,
    },
    recentApplications,
    recommendedJobs,
    savedJobsPreview,
    profileCompletion,
  };
};

type ApplicationTrendRow = Pick<
  IApplication,
  "createdAt" | "status"
>;

const buildApplicationsTrend = (
  applications: ApplicationTrendRow[]
) => {
  const months: { key: string; label: string }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
    });
  }

  const buckets = new Map(
    months.map((month) => [
      month.key,
      { applications: 0, interviews: 0, hires: 0 },
    ])
  );

  applications.forEach((application) => {
    const created = new Date(application.createdAt);
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const bucket = buckets.get(key);

    if (!bucket) return;

    bucket.applications += 1;

    if (application.status === "reviewed") {
      bucket.interviews += 1;
    }

    if (application.status === "shortlisted") {
      bucket.hires += 1;
    }
  });

  return months.map((month) => ({
    name: month.label,
    ...buckets.get(month.key)!,
  }));
};

export const getRecruiterDashboardService = async (
  recruiterId: string
) => {
  const jobs = await Job.find({ createdBy: recruiterId });
  const jobIds = jobs.map((job) => job._id);

  const jobFilter = { job: { $in: jobIds } };

  const openJobsCount = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const closedJobsCount = jobs.filter(
    (job) => job.status === "closed"
  ).length;

  const [
    totalApplications,
    pendingApplications,
    reviewedApplications,
    shortlistedApplications,
    rejectedApplications,
    recentApplications,
    openJobsList,
    trendSource,
  ] = await Promise.all([
    Application.countDocuments(jobFilter),
    Application.countDocuments({
      ...jobFilter,
      status: "pending",
    }),
    Application.countDocuments({
      ...jobFilter,
      status: "reviewed",
    }),
    Application.countDocuments({
      ...jobFilter,
      status: "shortlisted",
    }),
    Application.countDocuments({
      ...jobFilter,
      status: "rejected",
    }),
    Application.find(jobFilter)
      .populate("applicant", "name email role")
      .populate(
        "job",
        "title companyName location employmentType status"
      )
      .sort({ createdAt: -1 })
      .limit(5),
    Job.find({
      createdBy: recruiterId,
      status: "open",
    })
      .sort({ createdAt: -1 })
      .limit(5),
    jobIds.length > 0
      ? Application.find(jobFilter)
          .select("createdAt status")
          .sort({ createdAt: -1 })
      : Promise.resolve([]),
  ]);

  const applicationStats = {
    pending: pendingApplications,
    reviewed: reviewedApplications,
    shortlisted: shortlistedApplications,
    rejected: rejectedApplications,
  };

  const pipeline = [
    { stage: "Pending", count: pendingApplications },
    { stage: "Under review", count: reviewedApplications },
    { stage: "Shortlisted", count: shortlistedApplications },
    { stage: "Rejected", count: rejectedApplications },
  ];

  return {
    stats: {
      totalJobs: jobs.length,
      openJobs: openJobsCount,
      closedJobs: closedJobsCount,
      totalApplications,
    },
    applicationStats,
    pipeline,
    applicationsTrend: buildApplicationsTrend(trendSource),
    recentApplications,
    openJobs: openJobsList,
  };
};
