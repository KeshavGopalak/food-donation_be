import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  foodType: {
    type: String,
    required: true,
    enum: ["Bakery", "Produce", "Dairy", "Cooked Meals", "Beverages", "Other"],
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  expiryWindow: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Pending Pickup", "Completed", "Expired"],
    default: "Available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = (mongoose.models.Donation as mongoose.Model<any>) || mongoose.model("Donation", donationSchema as any);

export default Donation;
