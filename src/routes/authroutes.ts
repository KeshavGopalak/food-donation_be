import router from "express";
import express from "express";
const authRouter = express.Router();
import { loginAuth } from "../controllers/authcontrollers.ts";

authRouter.post("/login", loginAuth);
