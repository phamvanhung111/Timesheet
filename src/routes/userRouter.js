const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.LoginUser)
router.post('/refresh-token', userController.refreshToken)
router.get('/getAllUsers', authUserMiddleware, userController.getAllUsers);
router.get('/getAllRoles', authUserMiddleware, userController.getAllRoles);
router.get('/getInfo/:Id', authUserMiddleware, userController.getUserInfo);
module.exports = router;