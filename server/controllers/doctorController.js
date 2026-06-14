const appointmentModel = require("../models/appointmentModel");
const docModel = require("../models/docModel");

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docModel.findOne({
      userId: req.body.userId,
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

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

const userModel = require("../models/userModel");

const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment =
      await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
      );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await userModel.findById(
      appointment.userId
    );

    if (user) {
      user.notification.push({
        type: "appointment-status",
        message: `Your appointment has been ${status}`,
        appointmentId: appointment._id,
      });

      await user.save();
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Status update failed",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDoctorAppointmentsController,
  handleStatusController,
};