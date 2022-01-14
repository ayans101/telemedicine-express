const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/appointments", require("./appointments"));
router.use("/prescriptions", require("./prescriptions"));
router.use("/chatbot", require("./chatbot"));
router.use("/logs", require("./logs"));

module.exports = router;
