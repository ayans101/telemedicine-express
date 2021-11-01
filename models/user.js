const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Doctor', 'Patient', 'Kiosk_admin']
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    avatar: String,
    specialization: String,
    appointmentCount: Number,
    successfulAppointmentCount: Number,
    cancelledAppointmentCount: Number,
    patientCount: Number,
    futureAppointment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    preferredStartTime: String,
    preferredEndTime: String
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User; 