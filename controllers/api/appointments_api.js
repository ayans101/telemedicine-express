const Appointment = require("../../models/appointment");
const User = require("../../models/user");

module.exports.createAppointment = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    let details = {
      ...req.body,
      enabled: false,
    };
    await Appointment.create(details, function (err, appointment) {
      // await Appointment.create(details, async function (err, appointment) {
      //   for (uid of appointment.attendees) {
      //     let attendee = await User.findById(uid);
      //     if (attendee) {
      //       await attendee.futureAppointment.push(appointment);
      //       await attendee.save();
      //     }
      //   }
      return res.status(200).json({
        message: "Appointment Created Successfully",
        success: true,
        data: {
          appointment: appointment,
        },
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.updateAppointment = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator || creator.userType !== "Doctor") {
      return res.status(404).json({
        message: "User not found or User is not a Doctor",
        success: false,
      });
    }
    let appointment = await Appointment.findById(req.body._id);
    if (!appointment || !appointment.creator.equals(creator._id)) {
      return res.status(401).json({
        message: "Appointment not found or User not authorised",
        success: false,
      });
    }
    for (uid of appointment.attendees) {
      let attendee = await User.findById(uid);
      if (attendee) {
        await attendee.futureAppointment.pull(appointment._id);
        await attendee.save();
      }
    }
    await Appointment.findByIdAndUpdate(req.body._id, req.body);
    appointment = await Appointment.findById(req.body._id);
    for (uid of appointment.attendees) {
      let attendee = await User.findById(uid);
      if (attendee) {
        await attendee.futureAppointment.push(appointment);
        await attendee.save();
      }
    }
    return res.status(200).json({
      message: "Appointment Updated Successfully",
      success: true,
      data: {
        appointment: appointment,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.deleteAppointment = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator || creator.userType !== "Doctor") {
      return res.status(404).json({
        message: "User not found or User is not a Doctor",
        success: false,
      });
    }
    let appointment = await Appointment.findById(req.body.id);
    if (!appointment || !appointment.creator.equals(creator._id)) {
      return res.status(401).json({
        message: "Appointment not found or User not authorised",
        success: false,
      });
    }
    for (uid of appointment.attendees) {
      let attendee = await User.findById(uid);
      if (attendee) {
        await attendee.futureAppointment.pull(appointment._id);
        await attendee.save();
      }
    }
    await appointment.remove();
    return res.status(200).json({
      message: "Appointment Deleted Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.details = async function (req, res) {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Appointment Details Retrieved",
      success: true,
      data: {
        appointment: appointment,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.requestedAppointments = async function (req, res) {
  try {
    const { id } = req.params;
    let doctor = await User.findById(id.trim());
    if (!doctor || doctor.userType !== "Doctor") {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
      });
    }
    let list = [];
    // for (appointment_id of doctor.futureAppointment) {
    //   let appointment = await Appointment.findById(appointment_id);
    //   if (appointment.enabled === false) {
    //     list.push(appointment);
    //   }
    // }
    let pending_appointments = await Appointment.find({ enabled: false });
    for (appointment of pending_appointments) {
      for (doctor_id of appointment.doctors) {
        // if (toString(doctor_id) === toString(doctor._id)) {
        if (doctor_id.equals(doctor._id)) {
          list.push(appointment);
        }
      }
    }
    return res.status(200).json({
      message: "Requested Appointments List Retrieved",
      success: true,
      data: {
        list: list,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.acceptAppointment = async function (req, res) {
  try {
    let doctor = await User.findById(req.params.user_id);
    if (!doctor || doctor.userType !== "Doctor") {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
      });
    }
    await Appointment.findByIdAndUpdate(req.params.appointment_id, {
      enabled: true,
      doctors: [doctor],
    });
    let appointment = await Appointment.findById(req.params.appointment_id);
    await doctor.futureAppointment.push(appointment);
    await doctor.save();
    return res.status(200).json({
      message: "Appointment Request Accepted Successfully",
      success: true,
      data: {
        appointment: appointment,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
