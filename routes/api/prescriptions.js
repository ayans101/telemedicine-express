const express = require("express");
const router = express.Router();
const passport = require("passport");
const prescriptionApi = require("../../controllers/api/prescription_api");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  prescriptionApi.create
);
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  prescriptionApi.update
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  prescriptionApi.delete
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  prescriptionApi.findById
);
router.post(
  "/search",
  passport.authenticate("jwt", { session: false }),
  prescriptionApi.find
);
module.exports = router;
