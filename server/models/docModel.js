const mongoose = require("mongoose");

const docSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    fullName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1),
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    feesPerConsultation: {
      type: Number,
      required: true,
    },

    timings: {
      type: [String],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const docModel = mongoose.model("doctor", docSchema);

module.exports = docModel;