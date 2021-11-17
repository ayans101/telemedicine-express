const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: {
        type: String
    },
    otp: {
        type: Number
    }
});


const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp; 