import { Request, Response } from "express";

import {
  getCandidateDashboardService,
  getRecruiterDashboardService,
} from "../services/dashboard.service";

export const getCandidateDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboardData = await getCandidateDashboardService(
      (req as any).user._id
    );

    return res.status(200).json({
      success: true,
      dashboardData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecruiterDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboardData = await getRecruiterDashboardService(
      (req as any).user._id
    );

    return res.status(200).json({
      success: true,
      dashboardData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
