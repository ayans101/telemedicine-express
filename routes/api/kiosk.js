const express = require("express");
const router = express.Router();
const passport = require("passport");
const kioskApi = require("../../controllers/api/kiosk_api");

// (patients are in queue)
// kiosk1 makes appointments one by one
router.post(
  "/createAppointment",
  passport.authenticate("jwt", { session: false }),
  kioskApi.createAppointment
);

// (patients are in queue in the same order)
// kiosk2 fetches list of available rooms or doctors ready to visit
router.get(
  "/availableRooms",
  passport.authenticate("jwt", { session: false }),
  kioskApi.availableRooms
);

// (from the rooms available kiosk2 manually allots room/doctor for first patient in queue)
// marks the doctor as occupied by setting readyToVisit false
router.post(
  "/allotRoom",
  passport.authenticate("jwt", { session: false }),
  kioskApi.allotRoom
);

// (doctor visits the patient)
// kiosk2/doctor marks doctor available by setting readyToVisit true
// kiosk2/doctor deletes the appointment
router.delete(
  "/deleteAppointment",
  passport.authenticate("jwt", { session: false }),
  kioskApi.deleteAppointment
);

module.exports = router;
