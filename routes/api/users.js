const express = require('express');
const router = express.Router();
const usersApi = require('../../controllers/api/users_api');

router.post('/create-session', usersApi.createSession);
router.post('/register-user', usersApi.registerUser);

module.exports = router;