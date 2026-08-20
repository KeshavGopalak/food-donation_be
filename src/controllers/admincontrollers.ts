import User from "../model/user.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role, status, verified } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      status?: string;
      verified?: boolean;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const normalizedRole = (role || "user").toLowerCase();
    const allowedRoles = ["user", "volunteer", "admin"];
    const allowedStatuses = ["active", "inactive", "pending", "denied"];
    if (!allowedRoles.includes(normalizedRole)) return res.status(400).json({ message: "Invalid role" });
    if (status && !allowedStatuses.includes(status.toLowerCase())) return res.status(400).json({ message: "Invalid status" });
    if (verified != null && typeof verified !== "boolean") return res.status(400).json({ message: "Invalid verified value" });

    const existing = await User.findOne({ email }).exec();
    if (existing) return res.status(409).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: normalizedRole,
      status: status?.toLowerCase() || (normalizedRole === "volunteer" ? "pending" : "active"),
      verified: verified ?? normalizedRole !== "volunteer",
    });
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (userObj as any).password;
    return res.status(201).json({ user: userObj });
  } catch (error: any) {
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, verified, role } = req.body as {
      status?: string;
      verified?: boolean;
      role?: string;
    };

    const allowedStatuses = ["active", "inactive", "pending", "denied"];
    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (verified != null && typeof verified !== "boolean") {
      return res.status(400).json({ message: "Invalid verified value" });
    }

    const allowedRoles = ["user", "volunteer", "admin"];
    if (role && !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status.toLowerCase();
    if (verified != null) updateData.verified = verified;
    if (role) updateData.role = role.toLowerCase();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (userObj as any).password;

    res.status(200).json({ user: userObj });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
