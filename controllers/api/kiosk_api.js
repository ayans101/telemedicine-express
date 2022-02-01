const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const Log = require("../../models/log");

module.exports.createAppointment = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator || creator.userType !== "Kiosk_admin") {
      return res.status(404).json({
        message: "Kiosk restricted operation",
        success: false,
      });
    }
    await Appointment.create(req.body, async function (err, appointment) {
      let log = new Log({
        type: "Kiosk",
        user: creator,
        description: "Appointment Created",
      });
      await log.save();

      return res.status(200).json({
        message: "Appointment Created Successfully by Kiosk",
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

module.exports.availableRooms = async function (req, res) {
  try {
    let availableDoctors = await User.find({
      userType: "Doctor",
      readyToVisit: true,
    });
    return res.status(200).json({
      message: "Available doctors List",
      success: true,
      data: {
        availableDoctors: availableDoctors,
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

module.exports.allotRoom = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (!creator || creator.userType !== "Kiosk_admin") {
      return res.status(404).json({
        message: "Kiosk restricted operation",
        success: false,
      });
    }
    let doctorToBeMarked = await User.findById(req.body.doctor);
    doctorToBeMarked.readyToVisit = false;
    await doctorToBeMarked.save();

    let log = new Log({
      type: "Kiosk",
      user: creator,
      description: "Patient alloted to a doctor",
    });
    await log.save();

    return res.status(200).json({
      message: "Doctor marked occupied",
      success: true,
      data: {
        availableDoctors: availableDoctors,
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
    if (
      !creator ||
      !(creator.userType === "Kiosk_admin" || creator.userType === "Doctor")
    ) {
      return res.status(404).json({
        message: "Kiosk/Doctor restricted operation",
        success: false,
      });
    }
    let appointment = await Appointment.findById(req.body.appointment);
    await appointment.remove();
    let doctorToBeMarked = await User.findById(req.body.doctor);
    doctorToBeMarked.readyToVisit = true;
    await doctorToBeMarked.save();
    return res.status(200).json({
      message: "Doctor/room marked availble, appointment deleted",
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

module.exports.markUnmarkDocotor = async function (req, res) {
  try {
    let creator = await User.findById(req.body.creator);
    if (
      !creator ||
      !(creator.userType === "Kiosk_admin" || creator.userType === "Doctor")
    ) {
      return res.status(404).json({
        message: "Kiosk/Doctor restricted operation",
        success: false,
      });
    }
    let doctorToBeMarked = await User.findById(req.body.doctor);
    doctorToBeMarked.readyToVisit = req.body.readyToVisit;
    await doctorToBeMarked.save();
    return res.status(200).json({
      message: "Doctor/room marked availble/ not available",
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
