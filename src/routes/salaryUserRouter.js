const express = require('express');
const router = express.Router();
const salaryUserController = require("../controllers/salaryUserController");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');


router.post('/createSalaryUser', authMiddleware, salaryUserController.createSalaryUser)
module.exports = router;