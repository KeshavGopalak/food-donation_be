import express from "express";
import { createDonation, getAllDonations, getDonationById, getDonationsByDonor, updateDonationStatus, deleteDonation, getNearbySharedFood, searchDonationsByType } from "../controllers/donationcontroller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create a new donation (protected)
router.post("/create", createDonation);

// Get all donations
router.get("/all", getAllDonations);

// Get nearby shared food (recent available donations)
router.get("/nearby", getNearbySharedFood);

// Search donations by food type
router.get("/search", searchDonationsByType);

// Get donation by ID
router.get("/:id", getDonationById);

// Get donations by donor ID
router.get("/donor/:donorId", getDonationsByDonor);

// Update donation status (protected)
router.patch("/:id/status", updateDonationStatus);

// Delete donation (protected)
router.delete("/:id", deleteDonation);

export default router;
