const mongoose = require('mongoose');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const express = require('express');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// router.route('/forgotPassword').post(authController.forgotPassword);
router.post('/forgotPassword', authController.forgotPassword);

router.route('/').get(authController.protect, userController.getAllUsers);

module.exports = router;
