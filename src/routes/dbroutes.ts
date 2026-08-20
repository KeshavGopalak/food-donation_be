import express from "express";
import { getUserInfo } from "../controllers/dbcontrollers.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const dbrouter = express.Router();

dbrouter.get("/user", requireAuth, requireRole("user"), getUserInfo);

export default dbrouter;