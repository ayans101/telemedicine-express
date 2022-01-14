const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    enabled: {
      type: Boolean,
      required: false,
    },
    appointmentStartTime: {
      type: String,
      required: true,
    },
    appointmentEndTime: {
      type: String,
      required: true,
    },
    meetLink: {
      type: String,
      required: false,
    },
    recordingLink: String,
    prescriptionLinks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    reportLinks: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
