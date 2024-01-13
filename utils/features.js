const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();
const Labor = require("../models/labor");
const Employer = require("../models/employer");
const cookieSetterLabor = (res, token, set) => {
  res.setHeader(
    "Set-Cookie",
    serialize("LaborToken", set ? token : "", {
      path: "/",
      httpOnly: true,
      maxAge: set ? 10 * 24 * 60 * 60 : 0, // Change milliseconds to seconds
      sameSite: "None", // Set SameSite attribute
      secure: true, // Set secure attribute for HTTPS
    })
  );
};
const cookieSetterEmployer = (res, token, set) => {
  res.setHeader(
    "Set-Cookie",
    serialize("EmployerToken", set ? token : "", {
      path: "/",
      httpOnly: true,
      maxAge: set ? 10 * 24 * 60 * 60 : 0, // Change milliseconds to seconds
      sameSite: "None", // Set SameSite attribute
      secure: true, // Set secure attribute for HTTPS
    })
  );
};

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

const checkAuthLabor = async (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;

  const tokens = cookie.split(";").map((c) => c.trim().split("="));

  const laborToken = tokens.find(([name]) => name === "LaborToken");
  if (!laborToken) return null;

  const token = laborToken[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await Labor.findById(decoded._id);
  } catch (error) {
    return null;
  }
};

const checkAuthEmployer = async (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;

  const tokens = cookie.split(";").map((c) => c.trim().split("="));

  const employerToken = tokens.find(([name]) => name === "EmployerToken");
  if (!employerToken) return null;

  const token = employerToken[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await Employer.findById(decoded._id);
  } catch (error) {
    return null;
  }
};

module.exports = {
  cookieSetterLabor,
  generateToken,
  cookieSetterEmployer,
  checkAuthEmployer,
  checkAuthLabor,
};
