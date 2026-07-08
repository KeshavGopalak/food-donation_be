import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import connectDB from "./src/config/mongodb.js";
import authRouter from "./src/routes/authroutes.js";
// import databaseRouter from "./src/routes/database.js";
import { verifyToken } from "./src/middleware/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Allow cross-origin requests from frontend
app.use(cors({ origin: true }));

app.use("/api/auth", authRouter);
// app.use("/api/database", databaseRouter);

app.get('/api/database/ping', (_req, res) => res.json({ message: 'pong' }));

connectDB();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});