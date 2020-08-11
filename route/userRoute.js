const mongoose = require('mongoose');
const userController = require('./../controller/userController');
const express = require('express');

const router = express.Router();

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);

module.exports = router;
