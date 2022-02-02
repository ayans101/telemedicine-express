const express = require("express");
const router = express.Router();
const passport = require("passport");
const appointmentsApi = require("../../controllers/api/appointments_api");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.createAppointment
);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.updateAppointment
);
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.deleteAppointment
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.details
);
router.get(
  "/requestedAppointments/:id",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.requestedAppointments
);
router.post(
  "/accept",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.acceptAppointment
);
router.get(
  "/createdAppointments/:id",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.createdAppointments
);
router.get(
  "/:id/prescriptions",
  passport.authenticate("jwt", { session: false }),
  appointmentsApi.getAppointmentPrescriptions
);
module.exports = router;
