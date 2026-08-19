import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "volunteer", "admin"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending", "denied"],
    default: "pending"
  },
  verified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

const User = (mongoose.models.User as mongoose.Model<any>) || mongoose.model("User", userSchema as any);

export default User;