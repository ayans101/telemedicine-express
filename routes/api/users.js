const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersApi = require('../../controllers/api/users_api');

router.post('/login', usersApi.login);
router.post('/register', usersApi.register);
router.get('/:id', passport.authenticate('jwt', {session: false}), usersApi.profile);
router.post('/all-doctors', passport.authenticate("jwt", { session: false }), usersApi.getAllDoctors);
module.exports = router;