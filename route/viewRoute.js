const express = require('express');
const viewController = require('../controller/viewController');

const router = express.Router();

router.route('/').get(viewController.getOverview);

module.exports = router;
