const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllDoctorAppointmentsController,
  handleStatusController,
} = require("../controllers/doctorController");

const router = express.Router();

// Get Doctor Appointments
router.get(
  "/getdoctorappointments",
  authMiddleware,
  getAllDoctorAppointmentsController
);

// Approve / Reject Appointment
router.post(
  "/handlestatus",
  authMiddleware,
  handleStatusController
);

module.exports = router;