const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController')
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createAttendance', authUserMiddleware, attendanceController.createAttendanceController)
router.post('/getAttendance', authUserMiddleware, attendanceController.getAttendanceController);

module.exports = router;