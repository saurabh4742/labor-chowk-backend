// server/index.js
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require("./utils/db");
const laborRouter = require("./routes/labor");
const employerRouter = require("./routes/employer");
const sahayakRouter = require("./routes/sahayak");
const JobRoutes=require("./routes/job")
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT
const LaborAuthRoutes=require("./auth/labor")
const EmployerAuthRoutes=require("./auth/employer")
const sahayakAuthRouter=require("./auth/sahayak")
const admin = require("./utils/firebaseInit");
// Middleware
app.use(cors({
  origin: 'https://labour-chowk.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
connectDB();

// Worker routes
app.use("/api/labor", laborRouter(admin));
//Employer Routes
app.use("/api/employer", employerRouter(admin));
app.use("/api/sahayak",sahayakRouter(admin))
// Routes
app.use("/api/auth/labor", LaborAuthRoutes);
// Worker routes
app.use("/api/auth/employer", EmployerAuthRoutes);
app.use("/api/auth/sahayak",sahayakAuthRouter)
app.use("/api/vacancy", JobRoutes);

app.get("/", (req, res) => {
  res.status(200).json('Welcome, Its An Api');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
