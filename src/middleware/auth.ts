import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        email?: string;
        role?: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.session_token;
  const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id?: string;
      email?: string;
      role?: string;
    };
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const user = await User.findById(decoded.id).select("email role status").lean().exec();
    if (!user) {
      return res.status(403).json({ message: "Account is not active" });
    }

    if ((user.status === "pending" || user.status === "denied") && user.role !== "admin") {
      return res.status(403).json({ message: "Account is not active" });
    }

    req.user = { id: decoded.id, email: user.email, role: user.role };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have access to this resource" });
  }
  return next();
};
