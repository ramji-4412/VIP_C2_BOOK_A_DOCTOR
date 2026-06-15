const mongoose = require("mongoose");

const accountDeletionFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    fullName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    reason: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const accountDeletionFeedbackModel = mongoose.model(
  "accountDeletionFeedback",
  accountDeletionFeedbackSchema,
);

module.exports = accountDeletionFeedbackModel;
