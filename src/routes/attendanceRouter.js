const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createAttendance', authMiddleware, attendanceController.createAttendanceController)

module.exports = router;