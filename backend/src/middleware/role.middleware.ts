import {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  export const authorizeRoles =
    (...roles: string[]) =>
    (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
  
      const userRole = (req as any).user.role as string;
      const normalizedRole =
        userRole === "jobseeker" ? "candidate" : userRole;

      const allowed = roles.map((role) =>
        role === "jobseeker" ? "candidate" : role
      );

      if (!allowed.includes(normalizedRole)) {
        return res.status(403).json({
          success: false,
          message:
            "You are not allowed to access this resource",
        });
      }
  
      next();
    };