import express from "express";
import { createDonation, getAllDonations, getDonationById, getDonationsByDonor, updateDonationStatus, deleteDonation, getNearbySharedFood, searchDonationsByType, getDonationCount, searchDonationsByStatus } from "../controllers/donationcontroller.js";
import { requireAuth } from "../middleware/auth.js";


const router = express.Router();

// Create a new donation (protected)
router.post("/create", requireAuth, createDonation);

// Get all donations
router.get("/all", getAllDonations);

// Get nearby shared food (recent available donations)
router.get("/nearby", getNearbySharedFood);

// Search donations by food type
router.get("/search", searchDonationsByType);

// Search donations by status
router.get("/search/status/:status", searchDonationsByStatus);

// Get donations by donor ID
router.get("/donor/:donorId", getDonationsByDonor);

// Get donation count
router.get("/count", getDonationCount);

// Get donation by ID (parameterized route should come after more specific routes)
router.get("/:id", getDonationById);

// Update donation status (protected)
router.patch("/:id/status", updateDonationStatus);

// Delete donation (protected)
router.delete("/:id", deleteDonation);

export default router;
