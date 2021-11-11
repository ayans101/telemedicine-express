const Appointment = require('../../models/appointment');
const User = require('../../models/user');

module.exports.createAppointment = function(req, res) {
    return res.status(200).json({
        message: "Hello World",
        success: true
    });
}

module.exports.updateAppointment = function(req, res) {
    return res.status(200).json({
        message: "Hello World",
        success: true
    });
}

module.exports.deleteAppointment = function(req, res) {
    return res.status(200).json({
        message: "Hello World",
        success: true
    });
}

module.exports.details = function(req, res) {
    return res.status(200).json({
        message: "Hello World",
        success: true
    });
}