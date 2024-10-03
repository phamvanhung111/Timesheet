const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require('../middleware/authMiddleware'); 

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.LoginUser)
router.post('/refresh-token', userController.refreshToken)
router.get('/getAllUsers', authMiddleware, userController.getAllUsers);
module.exports = router;