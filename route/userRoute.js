const mongoose = require('mongoose');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const express = require('express');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Need to login to continue
router.use(authController.protect);

router.route('/me').get(userController.getMe, userController.getUser);
router
  .route('/updateMe')
  .patch(
    userController.uploadPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/updatePassword').patch(authController.updatePassword);

// Need to be an admin
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
