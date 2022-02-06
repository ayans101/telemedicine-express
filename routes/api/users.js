const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersApi = require("../../controllers/api/users_api");

router.post("/login", usersApi.login);
router.post("/register", usersApi.register);
router.get(
  "/all-patients",
  passport.authenticate("jwt", { session: false }),
  usersApi.getAllPatients
);
router.get(
  "/all-doctors",
  passport.authenticate("jwt", { session: false }),
  usersApi.getAllDoctors
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  usersApi.profile
);

module.exports = router;
