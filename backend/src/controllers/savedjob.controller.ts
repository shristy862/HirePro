import {
    Request,
    Response,
  } from "express";
  
  import {
    saveJobService,
    getSavedJobsService,
    removeSavedJobService,
  } from "../services/savedJob.service";
  
  
  // SAVE JOB
  export const saveJob =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const savedJob =
          await saveJobService(
            (req as any).user._id,
            req.params.jobId as string
          );
  
        return res.status(201).json({
          success: true,
          message:
            "Job saved successfully",
          savedJob,
        });
  
      } catch (error: any) {
  
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // GET SAVED JOBS
  export const getSavedJobs =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const savedJobs =
          await getSavedJobsService(
            (req as any).user._id
          );
  
        return res.status(200).json({
          success: true,
          total: savedJobs.length,
          savedJobs,
        });
  
      } catch (error: any) {
  
        return res.status(500).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // REMOVE SAVED JOB
  export const removeSavedJob =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        await removeSavedJobService(
          (req as any).user._id,
          req.params.jobId as string
        );
  
        return res.status(200).json({
          success: true,
          message:
            "Saved job removed",
        });
  
      } catch (error: any) {
  
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };