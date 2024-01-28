// server/routes/Sahayak.js
const express = require("express");
const Sahayak=require("../models/sahayak.js")
const router = express.Router();
const multer = require("multer");
const getFileNameFromUrl = require("../utils/getFileName.js");

function sahayakRouter(admin) {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // Get all Sahayaks route
  router.get("/all", async (req, res) => {
    try {
      const allSahayaks = await Sahayak.find();
      res.status(200).json(allSahayaks);
    } catch (error) {
      console.error("Error fetching Sahayaks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get Sahayak by ID
  router.get("/:id", async (req, res) => {
    try {
      const SahayakId = req.params.id;

      // Check if the Sahayak with the given ID exists
      const sahayak = await Sahayak.findById(SahayakId);

      if (!sahayak) {
        return res.status(404).json({ error: "Sahayak not found." });
      }

      res.status(200).json(sahayak);
    } catch (error) {
      console.error("Error fetching Sahayak by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Modify Sahayak by id
  router.put("/modify/:id", upload.single("image"), async (req, res) => {
    try {
      const { name, address, pincode } = req.body;
      const SahayakId = req.params.id;

      // Check if the Sahayak with the given ID exists
      const sahayak = await Sahayak.findById(SahayakId);

      if (!sahayak) {
        return res.status(404).json({ error: "Sahayak not found." });
      }

      // Update Sahayak details
      sahayak.name = name;
      sahayak.address = address;
      sahayak.pincode = pincode;

      if (req.file) {
        const originalname = req.file.originalname;
        const bucket = admin.storage().bucket();
        const file = bucket.file(originalname);

        // Upload the image to Firebase Storage
        await file.createWriteStream().end(req.file.buffer);

        // Get the download URL for the uploaded image
        const [imageUrl] = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2025",
        });

        // Save the image URL in the Sahayak details
        sahayak.profileImage = imageUrl;
      }

      // Save the updated Sahayak to the database
      await sahayak.save();

      res.status(200).json({ message: "Sahayak modified successfully." });
    } catch (error) {
      console.error("Error modifying Sahayak:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.put("/update/profileImage/:id", async (req, res) => {
    try {
      const SahayakId = req.params.id;
  
      // Retrieve the Sahayak from MongoDB using the ID
      const sahayak = await Sahayak.findById(SahayakId);
  
      if (!sahayak) {
        return res.status(404).json({ error: "Sahayak not found" });
      }
  
      // Retrieve the image URL from Sahayak
      const imageUrl = sahayak.profileImage;
  
      // If the Sahayak doesn't have an image, consider sending a response
      if (!imageUrl) {
        return res.status(404).json({ error: "Sahayak does not have a profile image" });
      }
  
      // Extract the image file name from the URL
      const fileName = getFileNameFromUrl(imageUrl);
  
      // Get a reference to the Firebase Storage bucket
      const bucket = admin.storage().bucket();
  
      // Delete the file from Firebase Storage
      await bucket.file(fileName).delete();
  
      console.log('Image deleted successfully from Firebase Storage.');
  
      // Update the Sahayak's profileImage to an empty string
      sahayak.profileImage = "";
  
      // Save the updated Sahayak to the database
      await sahayak.save();
  
      console.log('Sahayak profile image cleared successfully.');
  
      // Send the success response
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.put("/update/labor/:id", async (req, res) => {
    try {
      const laborId = req.params.id;
      const {SahayakId}=req.body;
      // Retrieve the Sahayak from MongoDB using the ID
      const sahayak = await Sahayak.findById(SahayakId);
  
      if (!sahayak) {
        return res.status(404).json({ error: "Sahayak not found" });
      }
  
      // Update the Sahayak's profileImage to an empty string
      sahayak.labors.push(laborId)
  
      // Save the updated Sahayak to the database
      await sahayak.save();
  
      console.log('Sahayak profile image cleared successfully.');
  
      // Send the success response
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  // Delete a Sahayak by ID route
  router.delete("/delete/:id", async (req, res) => {
    try {
      const SahayakId = req.params.id;
  
      // Check if the Sahayak with the given ID exists
      const sahayak = await Sahayak.findById(SahayakId);
  
      if (!sahayak) {
        return res.status(404).json({ error: "Sahayak not found." });
      }
  
      // Delete the Sahayak from the database
      await sahayak.remove();
  
      res.status(200).json({ message: "Sahayak deleted successfully." });
    } catch (error) {
      console.error("Error deleting Sahayak by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}

module.exports = sahayakRouter;