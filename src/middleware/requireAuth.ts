/* 
Hætti við að nota þetta

import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  request: Request & { user?: { id: number } },
  response: Response,
  next: NextFunction
) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }
  next();
};
*/