const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1),
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    phone: {
      type: String,
      default: "",
    },

    isDoctor: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    notification: {
      type: Array,
      default: [],
    },

    seenNotification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;