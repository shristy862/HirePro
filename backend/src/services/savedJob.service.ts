import SavedJob from "../models/SavedJob";

import Job from "../models/jobs";


// SAVE JOB
export const saveJobService =
  async (
    userId: string,
    jobId: string
  ) => {

    const job = await Job.findById(
      jobId
    );

    if (!job) {

      throw new Error(
        "Job not found"
      );

    }

    // Prevent duplicate save
    const alreadySaved =
      await SavedJob.findOne({
        user: userId,
        job: jobId,
      });

    if (alreadySaved) {

      throw new Error(
        "Job already saved"
      );

    }

    const savedJob =
      await SavedJob.create({
        user: userId,
        job: jobId,
      });

    return savedJob;
  };



// GET SAVED JOBS
export const getSavedJobsService =
  async (userId: string) => {

    return await SavedJob.find({
      user: userId,
    })
      .populate("job")
      .sort({
        createdAt: -1,
      });
  };



// REMOVE SAVED JOB
export const removeSavedJobService =
  async (
    userId: string,
    jobId: string
  ) => {

    const deletedJob =
      await SavedJob.findOneAndDelete({
        user: userId,
        job: jobId,
      });

    if (!deletedJob) {

      throw new Error(
        "Saved job not found"
      );

    }

    return deletedJob;
  };