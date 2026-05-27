import { Request, Response } from "express";

import Job from "../models/jobs";

// CREATE JOB
export const createJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      companyName,
      description,
      skills,
      salary,
      experience,
      location,
      employmentType,
    } = req.body;

    if (
      !title ||
      !companyName ||
      !description ||
      !salary ||
      !experience ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const job = await Job.create({
      title,
      companyName,
      description,
      skills,
      salary,
      experience,
      location,
      employmentType,
      createdBy: (req as Request & { user: { _id: string } }).user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.log("CREATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL JOBS
export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log("GET JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE JOB
export const getSingleJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log("GET SINGLE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE JOB
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userId = (req as Request & { user: { _id: string } }).user._id;

    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own jobs",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.log("UPDATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE JOB
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userId = (req as Request & { user: { _id: string } }).user._id;

    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own jobs",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("DELETE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
