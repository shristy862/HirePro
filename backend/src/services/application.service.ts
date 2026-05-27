import Application from "../models/application";

import Job from "../models/jobs";
import { sameMongoId } from "../utils/ids";

interface ApplyJobPayload {
  applicantId: string;
  jobId: string;
  resume?: string;
  coverLetter?: string;
}


// APPLY JOB
export const applyForJobService =
  async ({
    applicantId,
    jobId,
    resume,
    coverLetter,
  }: ApplyJobPayload) => {

    // Check Job
    const job = await Job.findById(jobId);

    if (!job) {

      throw new Error("Job not found");

    }

    // Prevent duplicate apply
    const alreadyApplied =
      await Application.findOne({
        applicant: applicantId,
        job: jobId,
      });

    if (alreadyApplied) {

      throw new Error(
        "You already applied for this job"
      );

    }

    const application =
      await Application.create({
        applicant: applicantId,
        job: jobId,
        resume,
        coverLetter,
      });

    return application;
  };



// GET MY APPLICATIONS
export const getMyApplicationsService =
  async (userId: string) => {

    return await Application.find({
      applicant: userId,
    })
      .populate("job")
      .sort({
        createdAt: -1,
      });
  };



// GET JOB APPLICANTS
export const getJobApplicantsService =
  async (
    jobId: string,
    recruiterId: string
  ) => {

    const job = await Job.findById(jobId);

    if (!job) {

      throw new Error("Job not found");

    }

    if (!sameMongoId(job.createdBy, recruiterId)) {
      throw new Error("Not authorized to view applicants");
    }

    return await Application.find({
      job: jobId,
    })
      .populate("applicant", "name email role")
      .populate("job", "title companyName location employmentType status")
      .sort({ createdAt: -1 });
  };



// UPDATE APPLICATION STATUS
export const updateApplicationStatusService =
  async (
    applicationId: string,
    recruiterId: string,
    status: string
  ) => {

    const allowedStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "rejected",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {

      throw new Error("Invalid status");

    }

    const application =
      await Application.findById(
        applicationId
      ).populate("job");

    if (!application) {

      throw new Error(
        "Application not found"
      );

    }

    const job: any = application.job;

    if (!sameMongoId(job.createdBy, recruiterId)) {
      throw new Error("Not authorized to update status");
    }

    application.status =
      status as
        | "pending"
        | "reviewed"
        | "shortlisted"
        | "rejected";

    await application.save();

    const updated = await Application.findById(applicationId)
      .populate("applicant", "name email role")
      .populate(
        "job",
        "title companyName location employmentType status createdBy"
      );

    if (!updated) {
      throw new Error("Application not found");
    }

    return updated;
  };



// GET SINGLE APPLICATION (RECRUITER)
export const getRecruiterApplicationByIdService = async (
  applicationId: string,
  recruiterId: string
) => {
  const application = await Application.findById(applicationId)
    .populate("applicant", "name email role")
    .populate(
      "job",
      "title companyName location employmentType status createdBy"
    );

  if (!application) {
    throw new Error("Application not found");
  }

  const job: any = application.job;

  if (!job || !sameMongoId(job.createdBy, recruiterId)) {
    throw new Error("Not authorized to view this application");
  }

  return application;
};

// GET ALL RECRUITER APPLICATIONS
export const getRecruiterApplicationsService =
  async (recruiterId: string) => {

    const jobs = await Job.find({
      createdBy: recruiterId,
    });

    const jobIds = jobs.map(
      (job) => job._id
    );

    return await Application.find({
      job: {
        $in: jobIds,
      },
    })
      .populate(
        "applicant",
        "name email role"
      )
      .populate(
        "job",
        "title companyName location employmentType status"
      )
      .sort({
        createdAt: -1,
      });
  };