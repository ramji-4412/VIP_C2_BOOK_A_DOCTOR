const userModel = require("../models/userModel");
const docModel = require("../models/docModel");
const appointmentModel = require("../models/appointmentModel");

// Get All Users
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");

    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get All Doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await docModel.find();

    res.status(200).send({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

const getApproveController = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "approved" },
      { new: true },
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const user = await userModel.findById(doctor.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.isDoctor = true;

    user.notification.push({
      type: "doctor-approved",
      message: "Congratulations! Your doctor account has been approved.",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Doctor approved successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Doctor approval failed",
      error: error.message,
    });
  }
};

const getRejectController = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "rejected" },
      { new: true },
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const user = await userModel.findById(doctor.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notification.push({
      type: "doctor-rejected",
      message: "Your doctor application has been rejected.",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Doctor rejected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Doctor rejection failed",
      error: error.message,
    });
  }
};

const displayAllAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

const getDashboardStatsController = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();

    const totalDoctors = await docModel.countDocuments();

    const totalAppointments = await appointmentModel.countDocuments();

    const pendingDoctors = await docModel.countDocuments({
      status: "pending",
    });

    res.status(200).send({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllDoctorsController,
  getApproveController,
  getRejectController,
  displayAllAppointmentController,
  getDashboardStatsController,
};
