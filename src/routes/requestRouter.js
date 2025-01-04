const express = require('express');
const router = express.Router();
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

const requestController = require('../controllers/requestController');

router.post('/createRequest', authUserMiddleware, requestController.createRequest)
router.get('/getAllRequestType', authUserMiddleware, requestController.getAllRequestType)
router.put('/approvelRequest/:Id', authMiddleware, requestController.approvelRequest)
router.put('/updateRequest/:requestId', authUserMiddleware, requestController.updateHourandType)
router.get('/getAllRequestByProject/:ProjectId', authMiddleware, requestController.getAllRequestByProject)
router.post('/getAllRequestByUser', authUserMiddleware, requestController.getAllRequestByUser)
router.get('/getAllRequestByPM', authMiddleware, requestController.getAllRequestByPM)
module.exports = router;