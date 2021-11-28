const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Prescription should be attached to an appointment"],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Prescription should be written by a doctor"],
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Prescription should be written for a patient"],
  },
  patientDetails: {
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Non-binary", "Female", "Male", "Undisclosed"],
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
  },
  body: {
    problemDescription: {
      type: String,
      required: [true, "What is the problem?"],
    },
    diagnosis: { type: String, required: [true, "A diagnosis should be made"] },
  },
  recommendations: {
    recommendedMedicines: [{ type: String }],
    recommendedTests: [{ type: String }],
  },
  nextAppointmentScheduled: { type: Boolean, required: true },
  nextAppointmentDate: {
    type: String,
    required: function () {
      return this.nextAppointmentScheduled;
    },
  },
  //   testReports: [
  //     {
  //       source: {
  //         file: { type: Buffer, required: true },
  //         filename: { type: String, required: true },
  //         mimetype: { type: String, required: true },
  //       },
  //     },
  //   ],
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
