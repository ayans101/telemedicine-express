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
    let rooms = await Appointment.find(
      { enabled: true, kioskRoom: true },
      { doctors: 1, attendees: 1 }
    ).populate([
      {
        path: "doctors",
        select: "-password",
      },
      {
        path: "attendees",
        select: "-password",
      },
    ]);
    return res.status(200).json({
      message: "Rooms Retrieved",
      success: true,
      data: rooms,
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
        markedDoctor: doctorToBeMarked,
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

module.exports.makeAvailable = async function (req, res) {
  try {
    let user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }
    user.readyToVisit = req.body.status;
    await user.save();
    return res.status(200).json({
      message: user.readyToVisit
        ? "Doctor/room marked availble"
        : "Doctor/room marked unavailable",
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
