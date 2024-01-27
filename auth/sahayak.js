const express = require("express");
const Sahayak = require("../models/sahayak.js")
const router = express.Router();
const bcrypt = require("bcrypt");
require('dotenv').config();
const { cookieSetterSahayak, generateToken ,checkAuthSahayak} = require("../utils/features.js");

//profile
router.get('/profile', async (req, res)=>{
  try{
    const sahayak = await checkAuthSahayak(req);
    if (!sahayak) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json({
      success:true,
      sahayak
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
      cookieSetterSahayak(res,"null",false)
      res.status(200).json({succes:true,message:"Loged out"})
  }
  catch (error) {
    console.error('Error logging out as sahayak:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
)
// Login route for sahayak

router.post('/login', async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) {
        return res.status(400).json({ error: 'Empty fields'});
      }
      // Check if the sahayak with the given phone number exists
      const sahayak = await Sahayak.findOne({ phoneNumber });
  
      if (!sahayak) {
        return res.status(400).json({ error: 'User not found.' ,sahayak});
      }
  
      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, sahayak.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the sahayak ID
      const token=generateToken(sahayak._id)
      cookieSetterSahayak(res,token,true)
      // Set the token as a cookie
  
      // Send a success message
      return res.status(200).json({ message: `Welcome back! ${sahayak.name}`, sahayak});
    } catch (error) {
      console.error('Error logging in sahayak:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// sahayak registration route
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
      let sahayak = await Sahayak.findOne({ phoneNumber});
      if (sahayak) {
        return res
          .status(400)
          .json({ error: "sahayak with this email already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new sahayak
      sahayak= await Sahayak.create({
        name,
        password: hashedPassword,
        phoneNumber,
        pincode,
        address,
        profileImage:"",
        labors: [],
      });
  
      // Save the sahayak to the database
      const token=generateToken(sahayak._id)
      cookieSetterSahayak(res,token,true)
  
      res.status(201).json({ message: "sahayak registered successfully." ,sahayak});
    } catch (error) {
      console.error("Error registering sahayak:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;