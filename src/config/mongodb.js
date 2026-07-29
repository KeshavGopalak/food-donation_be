import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function connectDB() {
    const mongoURI = process.env.MONGO_URI || "";
    mongoose.connect(mongoURI)
        .then(() => {
        console.log("MongoDB connected successfully");
    })
        .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
}
export default connectDB;
//# sourceMappingURL=mongodb.js.map