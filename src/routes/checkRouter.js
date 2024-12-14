const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController')
const checkOutController = require('../controllers/checkOutController')
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createCheckIn', authUserMiddleware, checkInController.createCheckIn)
router.post('/createCheckOut', authUserMiddleware, checkOutController.createCheckOut)
router.get('/getCheckInUser', authUserMiddleware, checkInController.getCheckInUser)
router.get('/getCheckOutUser', authUserMiddleware, checkOutController.getCheckOutUser)
router.post('/getWorkingTime', authUserMiddleware, checkInController.getWorkingTime)
module.exports = router;