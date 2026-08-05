import User from "../model/user.js";
import type { Request, Response } from "express";
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
    const { status, verified } = req.body as {
      status?: string;
      verified?: boolean;
    };

    const allowedStatuses = ["active", "inactive", "pending", "denied"];
    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (verified != null && typeof verified !== "boolean") {
      return res.status(400).json({ message: "Invalid verified value" });
    }

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status.toLowerCase();
    if (verified != null) updateData.verified = verified;

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
