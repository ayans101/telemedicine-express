const Prescription = require("../../models/prescription");
const Appointment = require("../../models/appointment");
const mongoose = require("mongoose");
const Log = require("../../models/log");

const checkValidPrescription = (prescription, res) => {
  if (!prescription) {
    return res.status(404).json({
      message: "No such Prescription exists.",
      success: false,
    });
  } else {
    return res.status(200).json({
      message: "Prescription found.",
      success: true,
      data: {
        prescription,
      },
    });
  }
};

const handleError = (err, res) => {
  console.log(err);
  return res.status(500).json({
    message: "Internal server error",
    success: false,
  });
};

module.exports.create = async function (req, res) {
  try {
    await Prescription.create(req.body, async function (err, prescription) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal Server Error", success: false });
      } else {
        let log = new Log({
          type: "Prescription",
          // user: user,
          description: "Prescription Created",
        });
        await log.save();

        let appointment = await Appointment.findById(
          prescription.appointmentId
        );
        appointment.prescriptionLinks.push(prescription);
        await appointment.save();

        return res.status(200).json({
          message: "Prescription created",
          success: true,
          data: {
            _id: prescription._id,
            prescription: prescription,
          },
        });
      }
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports.findById = async function (req, res) {
  try {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        message: "Invalid Id",
        success: false,
      });
    }
    Prescription.findById(req.params.id)
      .then((prescription) => {
        return checkValidPrescription(prescription, res);
      })
      .catch((error) => {
        return handleError(error, res);
      });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports.find = async function (req, res) {
  try {
    Prescription.findOne(req.body.query)
      .then((prescription) => {
        return checkValidPrescription(prescription, res);
      })
      .catch((error) => {
        return handleError(error, res);
      });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports.update = async function (req, res) {
  try {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        message: "Invalid Id",
        success: false,
      });
    }
    Prescription.findByIdAndUpdate(_id, req.body, { new: true })
      .then((prescription) => {
        return checkValidPrescription(prescription, res);
      })
      .catch((error) => {
        return handleError(error, res);
      });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports.delete = async function (req, res) {
  try {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        message: "Invalid Id",
        success: false,
      });
    }
    Prescription.findByIdAndDelete(req.params.id)
      .then((prescription) => {
        return res.status(200).json({
          success: true,
          message: "Prescription successdully deleted.",
        });
      })
      .catch((error) => {
        return handleError(error, res);
      });
  } catch (error) {
    return handleError(error, res);
  }
};
