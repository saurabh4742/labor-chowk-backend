const express = require("express");
const Employer = require("../models/employer.js")
const router = express.Router();
const bcrypt = require("bcrypt");
require('dotenv').config();
const { cookieSetterEmployer, generateToken ,checkAuthEmployer} = require("../utils/features.js");

//profile
router.get('/profile', async (req, res)=>{
  try{
    const employer = await checkAuthEmployer(req);
    if (!employer) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json({
      success:true,
      employer
    })
  }
  catch (error) {
    console.error('Error in profile fetching:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
)

//Logout
router.get('/logout', async (req, res)=>{
  try{
      cookieSetterEmployer(res,"null",false)
      res.status(200).json({succes:true,message:"Loged out"})
  }
  catch (error) {
    console.error('Error logging out as Employer:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
)
// Login route for Employer

router.post('/login', async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) {
        return res.status(400).json({ error: 'Empty fields'});
      }
      // Check if the Employer with the given phone number exists
      const employer = await Employer.findOne({ phoneNumber });
  
      if (!employer) {
        return res.status(400).json({ error: 'User not found.' ,employer});
      }
  
      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, employer.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the Employer ID
      const token=generateToken(employer._id)
      cookieSetterEmployer(res,token,true)
      // Set the token as a cookie
  
      // Send a success message
      return res.status(200).json({ message: `Welcome back! ${employer.name}`, employer});
    } catch (error) {
      console.error('Error logging in Employer:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Employer registration route
router.post("/register", async (req, res) => {
    try {
      const { name, password, phoneNumber, pincode, address} =
        req.body;
  
      // Validate email format
      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format." });
      }
  
      // Check if user with the same email already exists
      let employer = await Employer.findOne({ phoneNumber});
      if (employer) {
        return res
          .status(400)
          .json({ error: "Employer with this email already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new Employer
      employer= await Employer.create({
        name,
        password: hashedPassword,
        phoneNumber,
        pincode,
        address,
        profileImage:""
      });
  
      // Save the Employer to the database
      const token=generateToken(employer._id)
      cookieSetterEmployer(res,token,true)
  
      res.status(201).json({ message: "Employer registered successfully." ,employer});
    } catch (error) {
      console.error("Error registering Employer:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;