import type { ApiSuccessResponse } from "../types/api-response.types";

type HealthPayload = {
  status: string;
  timestamp: string;
};

export class HealthController {
  static getHealth(): ApiSuccessResponse<HealthPayload> {
    return {
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
