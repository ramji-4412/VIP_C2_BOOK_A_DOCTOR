const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const docModel = require("../models/docModel");
const appointmentModel = require("../models/appointmentModel");

const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Check Existing User
    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
        error: error.message,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isDoctor: user.isDoctor,
        type: user.type,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

const docController = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
      userId,
    } = req.body;

    // Check if already applied
    const existingDoctor = await docModel.findOne({
      userId,
    });

    if (existingDoctor) {
      return res.status(400).send({
        success: false,
        message: "Doctor profile already exists",
      });
    }

    // Create doctor application
    const newDoctor = new docModel({
      userId,
      fullName,
      email,
      phone,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
      status: "pending",
    });

    await newDoctor.save();

    // Notify Admin
    const adminUser = await userModel.findOne({
      type: "admin",
    });

    if (adminUser) {
      adminUser.notification.push({
        type: "doctor-application",
        message: `${fullName} has applied as a doctor`,
        doctorId: newDoctor._id,
      });

      await adminUser.save();
    }

    res.status(201).send({
      success: true,
      message: "Doctor application submitted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Doctor registration failed",
      error: error.message,
    });
  }
};

const appointmentController = async (req, res) => {
  try {
    const { userId, doctorId, userInfo, doctorInfo, date, time } = req.body;

    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      userInfo: JSON.parse(userInfo),
      doctorInfo: JSON.parse(doctorInfo),
      date,
      time,
      document: req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
          }
        : {},
    });

    await newAppointment.save();

    // Notify Doctor
    const doctor = await docModel.findById(doctorId);

    if (doctor) {
      const doctorUser = await userModel.findById(doctor.userId);

      if (doctorUser) {
        doctorUser.notification.push({
          type: "appointment-request",
          message: `New appointment request from ${JSON.parse(userInfo).fullName}`,
          appointmentId: newAppointment._id,
        });

        await doctorUser.save();
      }
    }

    res.status(201).send({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Appointment booking failed",
      error: error.message,
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({
      status: "approved",
    });

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

const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    const appointmentsWithDoctorName = appointments.map((appointment) => ({
      ...appointment._doc,
      doctorName: appointment.doctorInfo?.fullName || "Unknown Doctor",
    }));

    res.status(200).send({
      success: true,
      appointments: appointmentsWithDoctorName,
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

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

    res.status(200).send({
      success: true,
      notification: user.notification,
      seenNotification: user.seenNotification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

const markAllNotificationSeenController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

    user.seenNotification.push(...user.notification);
    user.notification = [];

    await user.save();

    res.status(200).send({
      success: true,
      message: "Notifications marked as seen",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Operation failed",
      error: error.message,
    });
  }
};

const cancelAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment =
      await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { status: "cancelled" },
        { new: true }
      );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Cancellation failed",
      error: error.message,
    });
  }
};

const deleteAllNotificationController = async (
  req,
  res
) => {
  try {
    const user = await userModel.findById(
      req.body.userId
    );

    user.notification = [];
    user.seenNotification = [];

    await user.save();

    res.status(200).send({
      success: true,
      message: "Notifications deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

const searchDoctorsController = async (
  req,
  res
) => {
  try {
    const { specialization } = req.query;

    const doctors = await docModel.find({
      status: "approved",
      specialization: {
        $regex: specialization,
        $options: "i",
      },
    });

    res.status(200).send({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getAllNotificationController,
  markAllNotificationSeenController,
  cancelAppointmentController,
  deleteAllNotificationController,
  searchDoctorsController,
};
