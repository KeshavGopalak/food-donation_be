import express from "express";
import { getAllUsers, updateUser } from "../controllers/admincontrollers.js";
import { requireAuth } from "../middleware/auth.js";


const adminRouter = express.Router();

adminRouter.get("/users", requireAuth, getAllUsers);
adminRouter.patch("/users/:id", requireAuth, updateUser);

export default adminRouter;