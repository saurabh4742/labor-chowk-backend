// server/routes/Labor.js
const express = require("express");
const Labor = require("../models/labor.js");
const router = express.Router();
const admin = require("firebase-admin");
const multer = require("multer");
require("dotenv").config();
const getFileNameFromUrl=require("../utils/getFileName.js")
const serviceAccount = require("../utils/serviceAccountKey.json");
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
};
admin.initializeApp(firebaseConfig);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Get all Labors route
router.get("/all", async (req, res) => {
  try {
    const labors = await Labor.find();
    res.status(200).json(labors);
  } catch (error) {
    console.error("Error fetching Labors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const LaborID = req.params.id;

    // Check if the Labor with the given ID exists
    const labor = await Labor.findById(LaborID);

    if (!labor) {
      return res.status(404).json({ error: "Labor not found." });
    }
    else{
      return res.status(200).json(labor);
    }
    
  } catch (error) {
    console.error("Error fetching Labor by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get Labor by number
router.get("/phone/:number", async (req, res) => {
  try {
    const LaborNumber = req.params.number;

    // Check if the Labor with the given ID exists
    const Labor = await Labor.findOne({phoneNumber:LaborNumber });

    if (!Labor) {
      return res.status(404).json({ error: "Labor not found." });
    }
    else{
      return res.status(200).json(Labor);
    }
    
  } catch (error) {
    console.error("Error fetching Labor by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify Labor by id
app.put("/modify/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, address, pincode, availability, experience } = req.body;
    const laborId = req.params.id;

    // Check if the Labor with the given ID exists
    const existingLabor = await Labor.findById(laborId);

    if (!existingLabor) {
      return res.status(404).json({ error: "Labor not found." });
    }

    // Update Labor details
    existingLabor.name = name;
    existingLabor.address = address;
    existingLabor.pincode = pincode;
    existingLabor.address = address;
    existingLabor.availability = availability;
    existingLabor.experience = experience;

    // Check if a file has been uploaded
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

      // Save the image URL in the Labor details
      existingLabor.imageUrl = imageUrl;
    }

    // Save the updated Labor to the database
    await existingLabor.save();

    res.status(200).json({ message: "Labor modified successfully." });
  } catch (error) {
    console.error("Error modifying Labor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update/profileImage/:id", async (req, res) => {
  try {
    const laborId = req.params.id;

    // Retrieve the Labor from MongoDB using the ID
    const labor = await Labor.findById(laborId);

    if (!labor) {
      return res.status(404).json({ error: "Labor not found" });
    }

    // Retrieve the image URL from Labor
    const imageUrl = labor.profileImage;

    // If the Labor doesn't have an image, consider sending a response
    if (!imageUrl) {
      return res.status(404).json({ error: "Labor does not have a profile image" });
    }

    // Extract the image file name from the URL
    const fileName = getFileNameFromUrl(imageUrl);

    // Get a reference to the Firebase Storage bucket
    const bucket = admin.storage().bucket();

    // Delete the file from Firebase Storage
    await bucket.file(fileName).delete();

    console.log('Image deleted successfully from Firebase Storage.');

    // Update the Labor's profileImage to an empty string
    labor.profileImage = "";

    // Save the updated Labor to the database
    await labor.save();

    console.log('Labor profile image cleared successfully.');

    // Send the success response
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Labor by ID route
router.delete("/delete/:id", async (req, res) => {
  try {
    const LaborId = req.params.id;

    // Check if the Labor with the given ID exists
    const existingLabor = await Labor.findById(LaborId);

    if (!existingLabor) {
      return res.status(404).json({ error: "Labor not found." });
    }

    // Delete the Labor from the database
    await existingLabor.remove();

    res.status(200).json({ message: "Labor deleted successfully." });
  } catch (error) {
    console.error("Error deleting Labor by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;



// For some reason, delete requests are not working, have to check what is the issue persistent.