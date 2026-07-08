import express from "express";
import { loginAuth, registerAuth } from "../controllers/authcontrollers.js";

const authRouter = express.Router();

authRouter.post("/register", registerAuth);
authRouter.post("/login", loginAuth);

export default authRouter;
