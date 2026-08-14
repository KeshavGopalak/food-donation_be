import express from "express";
import { loginAuth, logoutAuth, registerAuth } from "../controllers/authcontrollers.js";

const authRouter = express.Router();

authRouter.post("/register", registerAuth);
authRouter.post("/login", loginAuth);
authRouter.post("/logout", logoutAuth);

export default authRouter;
