import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }
  next();
};
