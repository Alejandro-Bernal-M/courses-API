const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-middlewares');
const { getEnrolled, completeCourse, getCourseDetails } = require('../controllers/user');

router.get('/user/getEnrolled', requireSignin, userMiddleware, getEnrolled);
router.patch('/user/:userId/courses/:courseId/mark-as-completed', requireSignin, userMiddleware, completeCourse);
router.get('/user/:userId/courses/:courseId', requireSignin, userMiddleware, getCourseDetails);

module.exports = router;