import {
    Request,
    Response,
  } from "express";
  
  import {
    applyJobService,
    getMyApplicationsService,
    getSingleApplicationService,
    withdrawApplicationService,
  } from "../services/candidateApplication.service";
  
  
  
  // APPLY JOB
  export const applyJob =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const {
          jobId,
          resume,
          coverLetter,
        } = req.body;
  
        const application =
          await applyJobService({
            candidateId:
              (req as any).user._id,
  
            jobId,
  
            resume,
  
            coverLetter,
          });
  
        return res.status(201).json({
          success: true,
          message:
            "Job applied successfully",
  
          application,
        });
  
      } catch (error: any) {
  
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // GET MY APPLICATIONS
  export const getMyApplications =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const applications =
          await getMyApplicationsService(
            (req as any).user._id
          );
  
        return res.status(200).json({
          success: true,
          applications,
        });
  
      } catch (error: any) {
  
        return res.status(500).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // GET SINGLE APPLICATION
  export const getSingleApplication =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const application =
          await getSingleApplicationService({
            applicationId:
              req.params.id as string,
  
            candidateId:
              (req as any).user._id,
          });
  
        return res.status(200).json({
          success: true,
          application,
        });
  
      } catch (error: any) {
  
        return res.status(404).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // WITHDRAW APPLICATION
  export const withdrawApplication =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        await withdrawApplicationService({
          applicationId:
            req.params.id as string,
  
          candidateId:
            (req as any).user._id,
        });
  
        return res.status(200).json({
          success: true,
          message:
            "Application withdrawn successfully",
        });
  
      } catch (error: any) {
  
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };