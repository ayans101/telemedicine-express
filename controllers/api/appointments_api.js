const Appointment = require('../../models/appointment');
const User = require('../../models/user');

module.exports.createAppointment = async function(req, res) {
    try {

        let creator = await User.findById(req.body.creator);
        if(!creator || creator.userType !== 'Doctor') {
            return res.status(404).json({
                message: "User not found or User is not a Doctor",
                success: false,
            });
        }
        await Appointment.create(req.body, async function(err, appointment) {
            for(uid of appointment.attendees) {
                let attendee = await User.findById(uid);
                attendee.futureAppointment.push(appointment);
                attendee.save();
            }
            return res.status(200).json({
                message: "Appointment Created Successfully",
                success: true,
                data: {
                    appointment: appointment
                }
            });
        });

    } catch {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });  
    }
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