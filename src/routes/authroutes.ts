import express from "express";
import { loginAuth, logoutAuth, registerAuth, updateProfile } from "../controllers/authcontrollers.js";
import { requireAuth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerAuth);
authRouter.post("/login", loginAuth);
authRouter.post("/logout", logoutAuth);
authRouter.put("/profile", requireAuth, updateProfile);

export default authRouter;
