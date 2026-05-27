import {
  Request,
  Response,
} from "express";

import {
  analyzeResumeService,
} from "../services/ai.service";


export const analyzeResume =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        resumeText,
      } = req.body;

      if (!resumeText) {

        return res.status(400).json({
          success: false,
          message:
            "Resume text is required",
        });

      }

      const analysis =
        await analyzeResumeService(
          resumeText
        );

      if (
        typeof analysis !== "string" ||
        !analysis.trim()
      ) {
        return res.status(502).json({
          success: false,
          message:
            "No AI response generated",
        });
      }

      return res.status(200).json({
        success: true,
        analysis: analysis.trim(),
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "AI analysis failed",
      });

    }

  };