import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const registerAuth = async (req: Request, res: Response) => {
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

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const allowedRoles = ["user", "volunteer", "admin"];
    const allowedStatuses = ["active", "inactive", "pending", "denied"];

    if (role && !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (verified != null && typeof verified !== "boolean") {
      return res.status(400).json({ message: "Invalid verified value" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role ? role.toLowerCase() : undefined,
      status: status ? status.toLowerCase() : undefined,
      verified: verified ?? false,
    });
    const userObj = user.toObject();
    // remove password before sending
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (userObj as any).password;
    return res.status(201).json({ user: userObj });
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

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    // delete (userObj as any).password;
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
    return res.status(200).json({ user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};