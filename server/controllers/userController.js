const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const docModel = require("../models/docModel");
const appointmentModel = require("../models/appointmentModel");
const accountDeletionFeedbackModel = require("../models/accountDeletionFeedbackModel");

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const hasNotification = (user, type, appointmentId) => {
  const allNotifications = [
    ...(user.notification || []),
    ...(user.seenNotification || []),
  ];

  return allNotifications.some(
    (item) =>
      item.type === type &&
      String(item.appointmentId || "") === String(appointmentId),
  );
};

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
    } = req.body;
    const userId = req.userId || req.body.userId;

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
    const { doctorId, userInfo, doctorInfo, date, time } = req.body;
    const userId = req.userId || req.body.userId;

    if (!userId || !doctorId || !userInfo || !doctorInfo || !date || !time) {
      return res.status(400).send({
        success: false,
        message: "Missing appointment booking details",
      });
    }

    const parsedUserInfo = JSON.parse(userInfo);
    const parsedDoctorInfo = JSON.parse(doctorInfo);

    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      userInfo: parsedUserInfo,
      doctorInfo: parsedDoctorInfo,
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

    const user = await userModel.findById(userId);

    if (user) {
      user.notification.push({
        type: "appointment-booked",
        message: `Your appointment with ${parsedDoctorInfo.fullName} has been booked for ${date} at ${time}.`,
        appointmentId: newAppointment._id,
        createdAt: new Date(),
      });

      await user.save();
    }

    // Notify Doctor
    const doctor = await docModel.findById(doctorId);

    if (doctor) {
      const doctorUser = await userModel.findById(doctor.userId);

      if (doctorUser) {
        doctorUser.notification.push({
          type: "appointment-request",
          message: `New appointment request from ${parsedUserInfo.fullName}`,
          appointmentId: newAppointment._id,
          createdAt: new Date(),
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
    const userId = req.userId || req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const todayAppointments = await appointmentModel.find({
      userId,
      date: getTodayDateString(),
      status: {
        $in: ["pending", "approved"],
      },
    });

    let addedReminder = false;

    todayAppointments.forEach((appointment) => {
      if (!hasNotification(user, "appointment-reminder", appointment._id)) {
        user.notification.push({
          type: "appointment-reminder",
          message: `Reminder: your appointment with ${appointment.doctorInfo?.fullName || "your doctor"} is today at ${appointment.time}.`,
          appointmentId: appointment._id,
          createdAt: new Date(),
        });
        addedReminder = true;
      }
    });

    if (addedReminder) {
      await user.save();
    }

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
    const userId = req.userId || req.body.userId;

    const appointment = await appointmentModel.findOneAndUpdate(
      {
        _id: appointmentId,
        userId,
      },
      { status: "cancelled" },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await userModel.findById(userId);

    if (user) {
      user.notification = (user.notification || []).filter(
        (item) =>
          item.type !== "appointment-reminder" ||
          String(item.appointmentId || "") !== String(appointment._id),
      );
      user.seenNotification = (user.seenNotification || []).filter(
        (item) =>
          item.type !== "appointment-reminder" ||
          String(item.appointmentId || "") !== String(appointment._id),
      );
      user.markModified("notification");
      user.markModified("seenNotification");

      user.notification.push({
        type: "appointment-cancelled",
        message: `Your appointment with ${appointment.doctorInfo?.fullName || "your doctor"} on ${appointment.date} at ${appointment.time} has been cancelled.`,
        appointmentId: appointment._id,
        createdAt: new Date(),
      });

      await user.save();
    }

    const doctor = await docModel.findById(appointment.doctorId);

    if (doctor) {
      const doctorUser = await userModel.findById(doctor.userId);

      if (doctorUser) {
        doctorUser.notification.push({
          type: "appointment-cancelled",
          message: `${appointment.userInfo?.fullName || "A patient"} cancelled an appointment scheduled for ${appointment.date} at ${appointment.time}.`,
          appointmentId: appointment._id,
          createdAt: new Date(),
        });

        await doctorUser.save();
      }
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

const clearAppointmentHistoryController = async (req, res) => {
  try {
    const result = await appointmentModel.deleteMany({
      userId: req.body.userId,
      status: {
        $in: ["cancelled", "completed", "rejected"],
      },
    });

    res.status(200).send({
      success: true,
      message: "Appointment history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Unable to clear appointment history",
      error: error.message,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);

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

const deleteAccountController = async (req, res) => {
  try {
    const { userId, password, reason = "", feedback = "" } = req.body;

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required to delete your account",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.type === "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin accounts cannot be deleted from the user dashboard",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    await accountDeletionFeedbackModel.create({
      userId,
      fullName: user.fullName,
      email: user.email,
      reason,
      feedback,
    });

    const doctor = await docModel.findOne({
      userId,
    });

    const appointmentFilter = doctor
      ? {
          $or: [
            { userId },
            { doctorId: doctor._id },
          ],
        }
      : { userId };

    const appointments = await appointmentModel.find(appointmentFilter).select("_id");
    const appointmentIds = appointments.map((appointment) => appointment._id);
    const notificationCleanupConditions = [];

    if (doctor) {
      notificationCleanupConditions.push({ doctorId: doctor._id });
      await docModel.findByIdAndDelete(doctor._id);
    }

    if (appointmentIds.length) {
      notificationCleanupConditions.push({ appointmentId: { $in: appointmentIds } });
    }

    await appointmentModel.deleteMany(appointmentFilter);

    if (notificationCleanupConditions.length) {
      await userModel.updateMany(
        {},
        {
          $pull: {
            notification: {
              $or: notificationCleanupConditions,
            },
            seenNotification: {
              $or: notificationCleanupConditions,
            },
          },
        },
      );
    }

    await userModel.findByIdAndDelete(userId);

    res.status(200).send({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Account deletion failed",
      error: error.message,
    });
  }
};

const searchDoctorsController = async (req, res) => {
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
  clearAppointmentHistoryController,
  deleteAllNotificationController,
  deleteAccountController,
  searchDoctorsController,
};
