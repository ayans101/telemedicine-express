const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersApi = require('../../controllers/api/users_api');

router.post('/create-session', usersApi.createSession);
router.post('/register-user', usersApi.registerUser);
router.post('/otp-verify', usersApi.verifyOTP);
router.get('/:id', passport.authenticate('jwt', {session: false}), usersApi.profile);
module.exports = router;