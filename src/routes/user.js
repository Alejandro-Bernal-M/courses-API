const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middlewares');
const { getEnrolled, completeCourse } = require('../controllers/user');

router.get('/user/getEnrolled', requireSignin, userMiddleware, getEnrolled);
router.patch('/user/:userId/completeCourse/:courseId', requireSignin, userMiddleware, completeCourse);

module.exports = router;