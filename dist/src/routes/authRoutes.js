const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', [
    body('username').isString(),
    body('password').isString().isLength({ min: 6 })
], authController.login);

module.exports = router;
