import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || typeof auth !== "string") return res.status(401).json({ message: "No token provided" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Invalid token format" });
  const token = parts[1];
  try {
    const secret = (process.env.JWT_SECRET || "dev-secret") as string;
    const payload = (jwt as any).verify(token, secret) as any;
    // attach user id
    (req as any).userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
