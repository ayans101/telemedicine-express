const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    appointmentStartTime: {
        type: String,
        required: true
    },
    appointmentEndTime: {
        type: String,
        required: true
    },
    meetLink: {
        type: String,
        required: true
    },
    recordingLink: String,
    prescriptionLinks: [
        {
            type: String
        }
    ],
    reportLinks: [
        {
            type: String
        }
    ],
}, {
    timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;