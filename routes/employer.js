// server/routes/Employer.js
const express = require("express");
const Employer = require("../models/employer.js")
const router = express.Router();
require('dotenv').config();
const admin = require("firebase-admin");
const multer = require("multer");
const getFileNameFromUrl=require("../utils/getFileName.js")
const serviceAccount = require("../utils/serviceAccountKey.json");
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
};
admin.initializeApp(firebaseConfig);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Get all Employers route
router.get("/all", async (req, res) => {
  try {
    const allEmployers = await Employer.find();
    res.status(200).json(allEmployers);
  } catch (error) {
    console.error("Error fetching Employers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Employer by ID
router.get("/:id", async (req, res) => {
  try {
    const employerId = req.params.id;

    // Check if the Employer with the given ID exists
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    res.status(200).json(employer);
  } catch (error) {
    console.error("Error fetching Employer by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify Employer by id
router.put("/modify/:id", upload.single("image"), async (req, res) => {
  try {
    const { name,  address, pincode } = req.body;

    const EmployerId = req.params.id;

    // Check if the Employer with the given ID exists
    const employer = await Employer.findById(EmployerId);

    if (!employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    // Update Employer details
    employer.name = name;
    employer.address=address;
    employer.pincode=pincode;

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

      // Save the image URL in the Employer details
      employer.profileImage=imageUrl;
    }

    // Save the updated employer to the database
    await employer.save();

    res.status(200).json({ message: "Employer modified successfully." });
  } catch (error) {
    console.error("Error modifying Employer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/profileImage/:id", async (req, res) => {
  try {
    const employerId = req.params.id;

    // Retrieve the employer from MongoDB using the ID
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return res.status(404).json({ error: "employer not found" });
    }

    // Retrieve the image URL from employer
    const imageUrl = employer.profileImage;

    // If the employer doesn't have an image, consider sending a response
    if (!imageUrl) {
      return res.status(404).json({ error: "employer does not have a profile image" });
    }

    // Extract the image file name from the URL
    const fileName = getFileNameFromUrl(imageUrl);

    // Get a reference to the Firebase Storage bucket
    const bucket = admin.storage().bucket();

    // Delete the file from Firebase Storage
    await bucket.file(fileName).delete();

    console.log('Image deleted successfully from Firebase Storage.');

    // Update the employer's profileImage to an empty string
    employer.profileImage = "";

    // Save the updated employer to the database
    await employer.save();

    console.log('employer profile image cleared successfully.');

    // Send the success response
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Delete a Employer by ID route
router.delete("/delete/:id", async (req, res) => {
  try {
    const EmployerId = req.params.id;

    // Check if the Employer with the given ID exists
    const employer = await Employer.findById(EmployerId);

    if (!employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    // Delete the Employer from the database
    await employer.remove();

    res.status(200).json({ message: "Employer deleted successfully." });
  } catch (error) {
    console.error("Error deleting Employer by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;



// For some reason, delete requests are not working, have to check what is the issue persistent.