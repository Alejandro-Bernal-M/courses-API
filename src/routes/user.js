const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middlewares');
const { getEnrolled } = require('../controllers/user');

router.get('/user/getEnrolled', requireSignin, userMiddleware, getEnrolled);

module.exports = router;