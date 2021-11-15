const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersApi = require('../../controllers/api/users_api');

router.post('/login', usersApi.login);
router.post('/register', usersApi.register);
router.get('/:id', passport.authenticate('jwt', {session: false}), usersApi.profile);
// router.post('/verify-otp', usersApi.verifyOTP);
// router.post('/generate-otp', usersApi.generateOTP);
module.exports = router;