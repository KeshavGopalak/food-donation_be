import express from "express";
import { getAllUsers, updateUser } from "../controllers/admincontrollers.js";

const adminRouter = express.Router();

adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id", updateUser);

export default adminRouter;