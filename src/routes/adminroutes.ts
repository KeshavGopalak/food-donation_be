import express from "express";
import { createUser, getAllUsers, updateUser } from "../controllers/admincontrollers.js";
import { requireAuth, requireRole } from "../middleware/auth.js";


const adminRouter = express.Router();

adminRouter.get("/users", requireAuth, requireRole("admin"), getAllUsers);
adminRouter.post("/users", requireAuth, requireRole("admin"), createUser);
adminRouter.patch("/users/:id", requireAuth, requireRole("admin"), updateUser);

export default adminRouter;