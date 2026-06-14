const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllUsersController,
  getAllDoctorsController,
  getApproveController,
  getRejectController,
  displayAllAppointmentController,
  getDashboardStatsController,
} = require("../controllers/adminController");

const router = express.Router();

// Get All Users
router.get(
  "/getallusers",
  authMiddleware,
  getAllUsersController
);

// Get All Doctors
router.get(
  "/getalldoctors",
  authMiddleware,
  getAllDoctorsController
);

// Approve Doctor
router.post(
  "/getapprove",
  authMiddleware,
  getApproveController
);

// Reject Doctor
router.post(
  "/getreject",
  authMiddleware,
  getRejectController
);

// Get All Appointments
router.get(
  "/getallappointments",
  authMiddleware,
  displayAllAppointmentController
);

router.get(
  "/dashboardstats",
  authMiddleware,
  getDashboardStatsController
);

module.exports = router;