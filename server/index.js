const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const connectToDB = require("./config/connectToDB");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static Folder for Uploaded Files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Database Connection
connectToDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("ArogyaMitra Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});