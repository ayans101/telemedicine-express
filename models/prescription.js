const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Prescription should be attached to an appointment"],
  },
  patientDetails: {
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  result: {
    problem: {
      type: String,
      required: [true, "What is the problem?"],
    },
    diagnosis: {
      type: String,
      required: [true, "A diagnosis should be made"],
    },
    medicines: [
      {
        medicine: String,
        dosage: String,
      },
    ],
    tests: [{ type: String }],
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
