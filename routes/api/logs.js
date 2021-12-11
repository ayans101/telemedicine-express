const express = require('express');
const router = express.Router();
const passport = require('passport');
const logsApi = require('../../controllers/api/logs_api');

router.post('/create', passport.authenticate('jwt', {session: false}), logsApi.create);
router.get('/all', passport.authenticate('jwt', {session: false}), logsApi.all);
router.get('/read/:id',  passport.authenticate('jwt', {session: false}), logsApi.read);
module.exports = router;