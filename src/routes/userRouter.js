const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.LoginUser)
router.post('/refresh-token', userController.refreshToken)
module.exports = router;