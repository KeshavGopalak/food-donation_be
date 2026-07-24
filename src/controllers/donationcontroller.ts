import type { Request, Response } from "express";
import Donation from "../model/donation.js";
// Create a new donation
export const createDonation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { foodType, itemName, quantity, expiryWindow, pickupLocation, photoUrl, description, donorId, donorName, donorEmail } = req.body;

    if (!foodType || !itemName || !quantity || !expiryWindow || !pickupLocation || !donorName || !donorEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const donation = new Donation({
      foodType,
      itemName,
      quantity,
      expiryWindow,
      pickupLocation,
      photoUrl: photoUrl || null,
      description: description || "",
      donorId,
      donorName,
      donorEmail,
      status: "Available",
    });

    const savedDonation = await donation.save();
    res.status(201).json({ message: "Donation created successfully", donation: savedDonation });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating donation", error: error.message });
  }
};

// Get all donations
export const getAllDonations = async (req: Request, res: Response): Promise<any> => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).populate("donorId", "name email");
    res.status(200).json({ donations });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
};

// Get donation by ID
export const getDonationById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id).populate("donorId", "name email");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ donation });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching donation", error: error.message });
  }
};

// Get donations by donor ID
export const getDonationsByDonor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { donorId } = req.params;
    const donations = await Donation.find({ donorId }).sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
};

// Update donation status
export const updateDonationStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Available", "Pending Pickup", "Completed", "Expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await Donation.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation status updated", donation });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating donation", error: error.message });
  }
};

// Delete donation
export const deleteDonation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting donation", error: error.message });
  }
};

// Get nearby shared food (recent donations)
export const getNearbySharedFood = async (req: Request, res: Response): Promise<any> => {
  try {
    const donations = await Donation.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("donorId", "name email");

    res.status(200).json({ donations });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching nearby shared food", error: error.message });
  }
};

// Search donations by food type
export const searchDonationsByType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { foodType } = req.query;

    if (!foodType) {
      return res.status(400).json({ message: "Food type is required" });
    }

    const donations = await Donation.find({ foodType, status: "Available" }).sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (error: any) {
    res.status(500).json({ message: "Error searching donations", error: error.message });
  }
};
