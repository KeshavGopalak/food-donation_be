import type { Request, Response } from "express";

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.user; // Assuming you have user information in the request object
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
    } catch (error: any) {
    return res.status(500).json({ message: "Error fetching user info", error: error.message });
  }
};