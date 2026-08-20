import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

const setSessionCookie = (res: Response, sessionToken: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("session_token", sessionToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  res.cookie("session_id", sessionToken, {
    httpOnly: false,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
};

export const registerAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, volunteerDetails } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      volunteerDetails?: {
        experience?: string;
        availability?: string;
        skills?: string;
        transportation?: string;
      };
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const allowedRoles = ["user", "volunteer", "admin"];
    const normalizedRole = role?.toLowerCase() || "user";
    if (!allowedRoles.includes(normalizedRole) || normalizedRole === "admin") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: normalizedRole,
      status: normalizedRole === "volunteer" ? "pending" : "active",
      verified: normalizedRole !== "volunteer",
      volunteerDetails: normalizedRole === "volunteer" ? volunteerDetails : undefined,
    });
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (userObj as any).password;

    if (normalizedRole === "volunteer") {
      return res.status(201).json({
        message: "Volunteer application submitted for approval",
        user: userObj,
      });
    }

    const sessionToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    setSessionCookie(res, sessionToken);
    return res.status(201).json({ user: userObj, token: sessionToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginAuth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    if ((user.status === "pending" || user.status === "denied") && user.role !== "admin") {
      return res.status(403).json({ message: user.role === "volunteer" ? "Your volunteer account is awaiting approval" : "Your account is inactive" });
    }

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (userObj as any).password;

    const sessionToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    setSessionCookie(res, sessionToken);
    return res.status(200).json({ user: userObj, token: sessionToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutAuth = async (_req: Request, res: Response) => {
  res.clearCookie("session_token", { path: "/" });
  res.clearCookie("session_id", { path: "/" });
  return res.status(200).json({ message: "Logged out" });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const { name, email, avatar } = req.body as {
      name?: string;
      email?: string;
      avatar?: string;
    };
    const updates: Record<string, string> = {};

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "Name cannot be empty" });
      updates.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: "Enter a valid email address" });
      }

      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } }).lean();
      if (duplicate) return res.status(409).json({ message: "That email address is already in use" });
      updates.email = normalizedEmail;
    }

    if (avatar !== undefined) {
      const match = avatar.match(/^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) return res.status(400).json({ message: "Use a JPEG, PNG, or WebP profile image" });

      const [, mimeType, extension, encodedImage] = match;
      if (!mimeType || !extension || !encodedImage) return res.status(400).json({ message: "Invalid profile image" });
      const imageBuffer = Buffer.from(encodedImage, "base64");
      if (imageBuffer.length > 2 * 1024 * 1024) return res.status(413).json({ message: "Profile images must be 2 MB or smaller" });

      const avatarDirectory = path.resolve("uploads", "avatars");
      await mkdir(avatarDirectory, { recursive: true });
      const fileName = `${randomUUID()}.${extension === "jpeg" ? "jpg" : extension}`;
      await writeFile(path.join(avatarDirectory, fileName), imageBuffer);
      updates.avatarUrl = `/uploads/avatars/${fileName}`;
      void mimeType;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select("-password").lean();
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    if (error?.code === 11000) return res.status(409).json({ message: "That email address is already in use" });
    return res.status(500).json({ message: "Unable to update profile" });
  }
};