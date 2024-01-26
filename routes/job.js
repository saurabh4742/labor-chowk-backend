const express = require("express");
const Job = require("../models/job.js");
const router = express.Router();
const {checkAuthEmployer}=require("../utils/features.js")
router.post("/create", async (req, res) => {
  try {
    const user = await checkAuthEmployer(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Destructure the request body
    const {
      title,
      qualification,
      officeAddress,
      areaPincode,
      dailySalary,

    } = req.body;

    employer=user._id
    const newJob = new Job({
      title,
      qualification,
      officeAddress,
      areaPincode,
      dailySalary,
      employer// Set the employer ID for the job
      // Assign more fields here
    });

    // Save the new job to the database
    await newJob.save();

    // Respond with a success message or the created job data
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    // Handle error cases and respond with an error message
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {

    const user = await checkAuthEmployer(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const jobId = req.params.id;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {

    const user = await checkAuthEmployer(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    
    const jobId = req.params.id;
    const {
      title,
      qualification,
      officeAddress,
      areaPincode,
      dailySalary,
      employer, // Assuming you have the employer ID to associate with the job
      // Add more fields as needed for update
    } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update job fields
    job.title = title;
    job.qualification = qualification;
    job.officeAddress = officeAddress;
    job.areaPincode = areaPincode;
    job.dailySalary = dailySalary;
    job.employer = employer; // Update the employer ID for the job

    // Save the updated job
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const _id=req.params.id
    const jobs = await Job.findById(_id);
      if(!jobs)
      {
        return res.status(400).json({error:"No jobs right now!"})
      }
      res.status(200).json(jobs);
    
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/my", async (req, res) => {
  try {
    const user = await checkAuthEmployer(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const jobs = await Job.find({ employer: user._id });

    if (!jobs || jobs.length === 0) {
      return res.status(400).json({ error: "No jobs for this employer" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs for the employer:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/all", async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();
      if(!jobs)
      {
        return res.status(400).json({error:"No jobs right now!"})
      }
      res.status(200).json(jobs);
    
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
module.exports = router;
