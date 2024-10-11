const express = require('express');
const router = express.Router();
const dailyController = require("../controllers/dailyController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createDaily', authUserMiddleware, dailyController.createDaily)
router.get('/getDailyByDateRange/:projectId', authUserMiddleware, dailyController.getDailyByDateRange)
module.exports = router;
