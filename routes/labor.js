// server/routes/Labor.js
const express = require("express");
const Labor = require("../models/labor.js");
const router = express.Router();




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
router.put("/modify/:id", async (req, res) => {
  try {
    const { name, address,pincode,availability,experience } = req.body;

    const LaborId = req.params.id;

    // Check if the Labor with the given ID exists
    const existingLabor = await Labor.findById(LaborId);

    if (!existingLabor) {
      return res.status(404).json({ error: "Labor not found." });
    }

    // Update Labor details
    existingLabor.name = name;
    existingLabor.address = address;
    existingLabor.pincode = pincode;
    existingLabor.address=address;
    existingLabor.availability=availability;
    existingLabor.experience=experience;

    // Save the updated Labor to the database
    await existingLabor.save();

    res.status(200).json({ message: "Labor modified successfully." });
  } catch (error) {
    console.error("Error modifying Labor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify Labor by email

// Delete a Labor by email route
router.delete("/delete/phone/:number", async (req, res) => {
  try {
    const LaborNumber = req.params.number;

    // Check if the Labor with the given email exists
    const existingLabor = await Labor.findOne({ phoneNumber: LaborNumber });

    if (!existingLabor) {
      return res.status(404).json({ error: "Labor not found." });
    }

    // Delete the Labor from the database
    await existingLabor.remove();

    res.status(200).json({ message: "Labor deleted successfully." });
  } catch (error) {
    console.error("Error deleting Labor by phonenumber:", error);
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