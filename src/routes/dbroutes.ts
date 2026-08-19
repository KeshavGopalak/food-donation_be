import express from "express";
import { getUserInfo } from "../controllers/dbcontrollers.js";

const dbrouter = express.Router();

dbrouter.get("/user", getUserInfo);

export default dbrouter;