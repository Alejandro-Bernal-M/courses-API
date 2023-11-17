const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware, userMiddleware } = require('../common-middlewares');
const { createCourse, getCourses, getSpecificCourse, enroll, searchCourses } = require('../controllers/course');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({storage: storage});

router.post('/admin/courses/create', requireSignin, adminMiddleware,upload.single('thumbnail'), createCourse);
router.patch('/courses/:id/enroll/:userId', requireSignin, userMiddleware, enroll);
router.get('/courses/search', searchCourses);
router.get('/courses/:id', getSpecificCourse);
router.get('/courses', getCourses);

module.exports = router;