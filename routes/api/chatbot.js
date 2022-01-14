const express = require("express");
const router = express.Router();
const passport = require("passport");
const chatbotApi = require("../../controllers/api/chatbot_api");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  chatbotApi.create
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  chatbotApi.details
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  chatbotApi.index
);
module.exports = router;
