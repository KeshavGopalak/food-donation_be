import mongoose from "mongoose";
import dotenv from "dotenv";
import { type Response, type Request } from 'express';

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
        required: true,
        unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  });
  export default mongoose.model("User", userSchema);