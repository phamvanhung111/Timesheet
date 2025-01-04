const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/sign-up', authMiddleware, userController.createUser)
router.post('/sign-in', userController.LoginUser)
router.post('/refresh-token', userController.refreshToken)
router.get('/getAllUsers', authUserMiddleware, userController.getAllUsers);
router.get('/getAllRoles', authMiddleware, userController.getAllRoles);
router.get('/getInfo/:Id', authUserMiddleware, userController.getUserInfo);
router.put('/updateUser/:Id', authUserMiddleware, userController.updateUser);
router.post('/getUserByEmail', authMiddleware, userController.getUserInfoByEmail);

router.post('/createRole', authMiddleware, userController.createRole)

router.get('/getAllUserNotInProject/:Id', authMiddleware, userController.getAllUserNotInProject);
router.get('/getAllUserInProject/:Id', authMiddleware, userController.getAllUserInProject);

module.exports = router;