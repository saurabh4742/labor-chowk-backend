// server/index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const LaborRoutes = require("./routes/labor");
const EmployerRoutes = require("./routes/employer");
const JobRoutes=require("./routes/job")
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5500;
const LaborAuthRoutes=require("./auth/labor")
const EmployerAuthRoutes=require("./auth/employer")
// Middleware
app.use(cors({
  credentials: true, 
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(cookieParser());
connectDB();


// Worker routes
app.use("/api/labor", LaborRoutes);
//Employer Routes
app.use("/api/employer", EmployerRoutes);
// Routes
app.use("/api/auth/labor", LaborAuthRoutes);
// Worker routes
app.use("/api/auth/employer", EmployerAuthRoutes);
app.use("/api/vacancy", JobRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
