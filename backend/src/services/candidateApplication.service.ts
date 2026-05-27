import Application from "../models/application";

/** Logged-in candidate's user id — stored as `applicant` on Application documents */
type ApplicantId = string;

// APPLY JOB
export const applyJobService = async ({
  candidateId,
  jobId,
  resume,
  coverLetter,
}: {
  candidateId: ApplicantId;
  jobId: string;
  resume: string;
  coverLetter?: string;
}) => {
  const alreadyApplied = await Application.findOne({
    applicant: candidateId,
    job: jobId,
  });

  if (alreadyApplied) {
    throw new Error("You already applied for this job");
  }

  const application = await Application.create({
    applicant: candidateId,
    job: jobId,
    resume,
    coverLetter,
  });

  return application;
};

// GET MY APPLICATIONS
export const getMyApplicationsService = async (
  candidateId: ApplicantId
) => {
  return Application.find({
    applicant: candidateId,
  })
    .populate({
      path: "job",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });
};

// GET SINGLE APPLICATION
export const getSingleApplicationService = async ({
  applicationId,
  candidateId,
}: {
  applicationId: string;
  candidateId: ApplicantId;
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    applicant: candidateId,
  }).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};

// WITHDRAW APPLICATION
export const withdrawApplicationService = async ({
  applicationId,
  candidateId,
}: {
  applicationId: string;
  candidateId: ApplicantId;
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    applicant: candidateId,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  await application.deleteOne();

  return true;
};
