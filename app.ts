import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/mongodb.js";
import authRouter from "./src/routes/authroutes.js";
import donationRouter from "./src/routes/donationroutes.js";
import adminRouter from "./src/routes/adminroutes.js";
import dbrouter from "./src/routes/dbroutes.js";
import path from "node:path";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 1. FIXED SLASHE: Removed the trailing slash at the end of the URL string
const allowedOrigins = [
  'http://localhost:3000',
  'https://foods-donations.netlify.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 2. CRITICAL PREFLIGHT FIX: Explicitly intercept and approve browser preflight requests
app.options('*path', cors()); 

app.use("/api/auth", authRouter);
app.use("/api/donations", donationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dbrouter)
app.use("/uploads", express.static(path.resolve("uploads")));

app.get('/api/database/ping', (_req, res) => res.json({ message: 'pong' }));

app.get('/', (_req, res) => res.send('Backend server is alive and running!'));

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
