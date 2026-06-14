const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    userInfo: {
      type: Object,
      required: true,
    },

    doctorInfo: {
      type: Object,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    document: {
      filename: {
        type: String,
        default: "",
      },

      originalname: {
        type: String,
        default: "",
      },

      mimetype: {
        type: String,
        default: "",
      },

      path: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model(
  "appointment",
  appointmentSchema
);

module.exports = appointmentModel;