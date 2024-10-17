const express = require('express');
const router = express.Router();
const dailyController = require("../controllers/dailyController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createDaily', authUserMiddleware, dailyController.createDaily)
router.get('/getDailyByDateRange/:projectId', authMiddleware, dailyController.getDailyByDateRange)
router.get('/getDailyByUser/:projectId', authUserMiddleware, dailyController.getDailyByUser);
router.post('/updateDaily/:Id', authUserMiddleware, dailyController.updateDaily)
module.exports = router;
