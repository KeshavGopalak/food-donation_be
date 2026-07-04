import mongoose from "mongoose";
import dotenv from "dotenv";
import { type Response, type Request } from 'express';

dotenv.config();
export const loginAuth = async (res: Response, req: Request) => {
  try {
    const { email, password } = req.body;
    const user = await mongoose.model("User").findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    // Add password verification logic here
    return user;
    
  } catch (error) {
    throw new Error("Authentication failed");
  }
  return res.status(200).json({ message: "Login successful" })
};