import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connectDB() {
  const mongoURI = process.env.MONGO_URI || "mongodb+srv://Interst3llarYT:Iz1WY7am9m8jQoCe@cluster0.ilaktqd.mongodb.net/Food_Donation?retryWrites=true&w=majority";
  mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}

export default connectDB;