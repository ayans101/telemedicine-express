const express = require('express');
const router = express.Router();
const testController = require('../controllers/test_controller');

console.log('router loaded');

router.get('/', testController.home);

module.exports = router;