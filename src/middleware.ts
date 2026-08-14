// Express-compatible middleware for the backend service.
// This file used to be copied from a Next.js project and imported `next/server.js`,
// which is not available in the Node/Express backend deployed on Render.

import type { Request, Response, NextFunction } from "express";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session_token;
  const pathname = req.originalUrl || req.url || "/";

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return res.redirect("/login");
  }

  return next();
}

export default middleware;

