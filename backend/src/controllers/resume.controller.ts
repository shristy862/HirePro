import {
    Request,
    Response,
  } from "express";
  
  import {
    uploadResumeService,
    getResumeService,
  } from "../services/resume.service";
  
  
  // UPLOAD RESUME
  export const uploadResume =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        if (!req.file) {
  
          return res.status(400).json({
            success: false,
            message:
              "Resume file is required",
          });
  
        }
  
        const resumeUrl = `/uploads/${req.file.filename}`;
  
        const updatedUser =
          await uploadResumeService(
            (req as any).user._id,
            resumeUrl
          );
  
        return res.status(200).json({
          success: true,
          message:
            "Resume uploaded successfully",
          user: updatedUser,
        });
  
      } catch (error: any) {
  
        return res.status(500).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };
  
  
  
  // GET RESUME
  export const getResume =
    async (
      req: Request,
      res: Response
    ) => {
  
      try {
  
        const user =
          await getResumeService(
            (req as any).user._id
          );
  
        return res.status(200).json({
          success: true,
          resume:
            user.resume,
        });
  
      } catch (error: any) {
  
        return res.status(500).json({
          success: false,
          message:
            error.message,
        });
  
      }
  
    };