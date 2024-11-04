const express = require('express');
const router = express.Router();
const projectController = require("../controllers/projectController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/createProject', authMiddleware, projectController.createProject)
router.get('/getAllProject', authMiddleware, projectController.getAllProject)
router.post('/addUsersToProject', authMiddleware, projectController.addUsersToProject)
router.post('/removeUsersToProject', authMiddleware, projectController.removeUsersFromProject)
router.put('/updateProject/:Id', authMiddleware, projectController.updateProject)
router.post('/searchProjectByName', authMiddleware, projectController.searchProjectByName)
router.get('/getProjectByUserId', authUserMiddleware, projectController.getProjectByUserId)
module.exports = router;
