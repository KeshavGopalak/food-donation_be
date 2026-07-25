import express from "express";
import cors from "cors";
// 1. REMOVED TYPE IMPORTS: JavaScript engines do not understand 'import type'
import connectDB from "./src/config/mongodb.js";
import authRouter from "./src/routes/authroutes.js";
import donationRouter from "./src/routes/donationroutes.js";
import { verifyToken } from "./src/middleware/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. UPDATED CORS: Allow BOTH localhost for testing and your live Netlify frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://foods-donations.netlify.app/' // Replace with your actual Netlify domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/donations", donationRouter);

app.get('/api/database/ping', (_req, res) => res.json({ message: 'pong' }));

// Root route to let you easily verify if Render successfully booted up the server
app.get('/', (_req, res) => res.send('Backend server is alive and running!'));

connectDB();

// 3. UPDATED PORT STRING HANDLING: Render passes the port as a string
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
