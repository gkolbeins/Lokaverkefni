import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export const authenticateToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    return response.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return response.status(401).json({ message: "Token missing" });
  }

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  request.user = {
    id: decoded.userId,
  };

  next();
    } catch {
      return response
        .status(403)
        .json({ message: "Invalid or expired token" });
    }
};
