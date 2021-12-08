const express = require('express');
const router = express.Router();
const passport = require('passport');
const logsApi = require('../../controllers/api/logs_api');

router.post('/create', passport.authenticate('jwt', {session: false}), logsApi.create);

module.exports = router;