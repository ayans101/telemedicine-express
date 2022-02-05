const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const Log = require("../../models/log");

module.exports.createAppointment = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    await Appointment.create(req.body, async function (err, appointment) {
      let log = new Log({
        type: "Appointment",
        user: creator,
        description: "Appointment Created",
      });
      await log.save();

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

module.exports.getAppointmentPrescriptions = async function (req, res) {
  try {
    let appointment = await Appointment.findById(req.params.id).populate(
      "prescriptionLinks"
    );
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Prescription Details Retrieved",
      success: true,
      data: {
        prescriptions: appointment.prescriptionLinks,
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
    let doctor = await User.findById(req.params.id);
    if (!doctor || doctor.userType !== "Doctor") {
      return res.status(204).json({
        message: "No appointments for non-doctors",
        data: {
          list: [],
        },
      });
    }
    let pending_appointments = await Appointment.find({
      enabled: false,
      doctors: { $in: [doctor] },
      kioskRoom: false,
    }).populate({
      path: "creator",
      select: "-password",
    });
    return res.status(200).json({
      message: "Requested Appointments List Retrieved",
      success: true,
      data: {
        list: pending_appointments,
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
    let doctor = await User.findById(req.body.user_id);
    if (!doctor || doctor.userType !== "Doctor") {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
      });
    }
    await Appointment.findByIdAndUpdate(req.body.appointment_id, {
      enabled: true,
      doctors: [doctor],
    });
    let appointment = await Appointment.findById(req.body.appointment_id);
    await doctor.futureAppointment.push(appointment);
    await doctor.save();

    let log = new Log({
      type: "Appointment",
      user: doctor,
      description: "Appointment Accepted",
    });
    await log.save();

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

module.exports.createdAppointments = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    let personalAppointments = await Appointment.find(
      { creator: user, enabled: true, kioskRoom: false },
      { appointmentStartTime: 1, appointmentEndTime: 1, doctors: 1, creator: 1 }
    )
      .sort("-appointmentStartTime")
      .populate([
        {
          path: "doctors",
          select: "-password",
        },
        {
          path: "creator",
          select: "-password",
        },
      ]);
    let appointments = await Appointment.find(
      { doctors: [user], enabled: true, kioskRoom: false },
      { appointmentStartTime: 1, appointmentEndTime: 1, doctors: 1, creator: 1 }
    )
      .sort("-appointmentStartTime")
      .populate([
        {
          path: "doctors",
          select: "-password",
        },
        {
          path: "creator",
          select: "-password",
        },
      ]);
    return res.status(200).json({
      message: "Created Appointments List Retrieved",
      success: true,
      data: {
        personalAppointments: personalAppointments,
        appointments: appointments,
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
