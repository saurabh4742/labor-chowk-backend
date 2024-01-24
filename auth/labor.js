const express = require("express");
const Labor = require("../models/labor.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const { cookieSetterLabor, generateToken ,checkAuthLabor} = require("../utils/features.js");
require('dotenv').config();

//profile
router.get('/profile', async (req, res)=>{
  try{
    const labor = await checkAuthLabor(req);
    if (!labor) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json({
      success:true,
      labor
    })
  }
  catch (error) {
    console.error('Error in profile fetching:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
)

router.get('/logout', async (req, res)=>{
  try{
      cookieSetterLabor(res,"null",false)
      res.status(200).json({succes:true,message:"Loged out"})
  }
  catch (error) {
    console.error('Error logging out as Labor:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
)
// Login route for Labors

router.post('/login', async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
  
      // Check if the Labor with the given phone number exists
      const labor = await Labor.findOne({ phoneNumber });
  
      if (!labor) {
        return res.status(400).json({ error: 'user not found.' });
      }
  
      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, labor.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the Labor ID
      const token=generateToken(labor._id)
      cookieSetterLabor(res,token,true)
      // Set the token as a cookie
  
      // Send a success message
      return res.status(200).json({ message: `Welcome back ! ${labor.name}`, labor});
    } catch (error) {
      console.error('Error logging in Labor:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Labor registration route

  router.post("/register", async (req, res) => {
    try {
      const { name, password, phoneNumber, address, pincode, skills ,experience } = req.body;
  
      // Validate required fields
      if (!name || !password || !phoneNumber || !address || !pincode || !skills || !experience) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: "phone number should contain 10 digit only." });
      }
  
      // Check if user with the same phone number already exists
      let labor = await Labor.findOne({ phoneNumber });
      if (labor) {
        return res.status(400).json({ error: "user already registered with this phonenumber" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new Labor
      labor = await Labor.create({
        name,
        password: hashedPassword,
        phoneNumber,
        pincode,
        address,
        skills,
        experience,
        availability: true ,
        profileImage:""
      });
      const token=generateToken(labor._id)
      cookieSetterLabor(res,token,true)
  
      res.status(201).json({ message: "user registered successfully.", labor });
    } catch (error) {
      console.error("Error registering Labor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;