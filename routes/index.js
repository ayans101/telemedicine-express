const express = require('express');
const router = express.Router();
const testController = require('../controllers/test_controller');

console.log('router loaded');

router.get('/', testController.test);
router.use('/api', require('./api'));

module.exports = router;