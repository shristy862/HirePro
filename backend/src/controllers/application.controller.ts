import {
    Request,
    Response,
  } from "express";
  
  import {
    applyForJobService,
    getJobApplicantsService,
    getMyApplicationsService,
    getRecruiterApplicationByIdService,
    getRecruiterApplicationsService,
    updateApplicationStatusService,
  } from "../services/application.service";
  
  import { applyJobSchema } from "../validators/application.validator";
  
  
  // APPLY JOB
  export const applyJob = async (
    req: Request,
    res: Response
  ) => {
  
    try {
  
      const parsedData =
        applyJobSchema.parse(req.body);
  
      const application =
        await applyForJobService({
          applicantId:
            (req as any).user._id,
          jobId: req.params.id as string,
          resume:
            parsedData.resume,
          coverLetter:
            parsedData.coverLetter,
        });
  
      return res.status(201).json({
        success: true,
        message:
          "Applied successfully",
        application,
      });
  
    } catch (error: any) {
  
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Something went wrong",
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
          total: applications.length,
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
  
  
  
  // GET JOB APPLICANTS
  export const getJobApplicants =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const applicants =
          await getJobApplicantsService(
            req.params.id as string,
            (req as any).user._id
          );
  
        return res.status(200).json({
          success: true,
          total: applicants.length,
          applicants,
        });
  
      } catch (error: any) {
  
        return res.status(400).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // UPDATE APPLICATION STATUS
  export const updateApplicationStatus =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const application =
          await updateApplicationStatusService(
              req.params.applicationId as string,
              (req as any).user._id,
              req.body.status
          );
  
        return res.status(200).json({
          success: true,
          message:
            "Application updated",
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
  
  
  
  // GET SINGLE APPLICATION (RECRUITER)
  export const getRecruiterApplicationById =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const application =
          await getRecruiterApplicationByIdService(
            req.params.id as string,
            (req as any).user._id
          );

        return res.status(200).json({
          success: true,
          application,
        });

      } catch (error: any) {

        const status =
          error.message === "Application not found"
            ? 404
            : 400;

        return res.status(status).json({
          success: false,
          message:
            error.message,
        });

      }

    };


  // GET RECRUITER APPLICATIONS
  export const getRecruiterApplications =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const applications =
          await getRecruiterApplicationsService(
            (req as any).user._id
          );
  
        return res.status(200).json({
          success: true,
          total: applications.length,
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