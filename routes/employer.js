// server/routes/Employer.js
const express = require("express");
const Employer = require("../models/employer.js")
const router = express.Router();
require('dotenv').config();




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

// Get Employer by email
router.get("/email/:email", async (req, res) => {
  try {
    const EmployerEmail = req.params.email;

    // Check if the Employer with the given email exists
    const Employer = await Employer.findOne({ email: EmployerEmail });

    if (!Employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    res.status(200).json(Employer);
  } catch (error) {
    console.error("Error fetching Employer by email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify Employer by id
router.put("/modify/:id", async (req, res) => {
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

    // Exclude email from being updated

    // Save the updated Employer to the database
    await employer.save();

    res.status(200).json({ message: "Employer modified successfully." });
  } catch (error) {
    console.error("Error modifying Employer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Modify Employer by email
router.put("/modify/email/:email", async (req, res) => {
  try {
    const {
      username,
      password,
      phoneNumber,
      address,
      vacancies,
      // Exclude email from being updated
    } = req.body;

    const EmployerEmail = req.params.email;

    // Check if the Employer with the given email exists
    const employer = await Employer.findOne({ email: EmployerEmail });

    if (!employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    // Update Employer details
    employer.username = username;
    employer.password = password ? await bcrypt.hash(password, 10) : employer.password; // Update password only if provided
    employer.phoneNumber = phoneNumber;
    employer.address = address;
    employer.vacancies = vacancies;
    // Exclude email from being updated

    // Save the updated Employer to the database
    await employer.save();

    res.status(200).json({ message: "Employer modified successfully." });
  } catch (error) {
    console.error("Error modifying Employer by email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Employer by email route
router.delete("/delete/email/:email", async (req, res) => {
  try {
    const EmployerEmail = req.params.email;

    // Check if the Employer with the given email exists
    const employer = await Employer.findOne({ email: EmployerEmail });

    if (!employer) {
      return res.status(404).json({ error: "Employer not found." });
    }

    // Delete the Employer from the database
    await employer.remove();

    res.status(200).json({ message: "Employer deleted successfully." });
  } catch (error) {
    console.error("Error deleting Employer by email:", error);
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