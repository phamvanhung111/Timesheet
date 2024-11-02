const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController')
const checkOutController = require('../controllers/checkOutController')
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createCheckIn', authUserMiddleware, checkInController.createCheckIn)
router.post('/createCheckOut', authUserMiddleware, checkOutController.createCheckOut)

module.exports = router;