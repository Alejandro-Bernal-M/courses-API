const Course = require('../models/course');
const User = require('../models/user');

function getDueDate(duration, enrolledAt){
  const durationParts = duration.split(' '); // Split the duration into parts, e.g., ['8', 'weeks']

  if (durationParts.length !== 2 || isNaN(parseInt(durationParts[0]))) {
    throw new Error('Invalid duration format');
  }

  const [amount, unit] = durationParts;
  const amountInt = parseInt(amount);

  if (unit.toLowerCase() === 'weeks') {
    const dueDate = new Date(enrolledAt);
    dueDate.setDate(dueDate.getDate() + amountInt * 7); // Convert weeks to days
    return dueDate;
  } else {
    throw new Error('Unsupported duration unit');
  }
}

function getProgress(enrolledAt, duration, completed) {
  if (completed) {
    return 100;
  }
  const dueDate = getDueDate(duration, enrolledAt);
  const now = new Date();
  const totalDuration = dueDate.getTime() - enrolledAt.getTime();
  const elapsedDuration = now.getTime() - enrolledAt.getTime();
  const progress = (elapsedDuration / totalDuration) * 100;
  return progress;
}

exports.getEnrolled = async(req, res) => {
  const userId = req.user._id;
  const enrolledCourses = await User.findById(userId).populate('enrolledCourses.course').select('enrolledCourses');
  const courses = enrolledCourses.enrolledCourses.map(course => {
    return {
      _id: course.course._id,
      name: course.course.name,
      instructor: course.course.instructor,
      thumbnail: course.course.thumbnail,
      description: course.course.description,
      enrolledAt: course.enrolledAt,
      completed: course.completed,
      completedAt: course.completedAt,
      dueDate: getDueDate(course.course.duration, course.enrolledAt),
      progress: getProgress(course.enrolledAt, course.course.duration, course.completed)
    }
  });
  return res.json({courses});
};

exports.completeCourse = async(req, res) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;
  const foundUser = await User.findById(userId);
  if(!foundUser){
    return res.status(400).json({message: "User not found"});
  }

  if(foundUser.enrolledCourses.length == 0){
    return res.status(400).json({message: "User not enrolled in any course"});
  }
  if(!foundUser.enrolledCourses.some(course => course.course == courseId)){
    return res.status(400).json({message: "User not enrolled in this course"});
  }

  foundUser.enrolledCourses.forEach(course => {
    if (course.course == courseId) {
      course.completed = true;
      course.completedAt = new Date();
    }
  });
  try {
    await foundUser.save();
    return res.json({message: "Course completed successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Something went wrong", error});
  }
};

exports.getCourseDetails = async(req, res) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;
  const foundUser = await User.findById(userId);
  if(!foundUser){
    return res.status(400).json({message: "User not found"});
  }
  if(foundUser.enrolledCourses.length == 0){
    return res.status(400).json({message: "User not enrolled in any course"});
  }
  if(!foundUser.enrolledCourses.some(course => course.course == courseId)){
    return res.status(400).json({message: "User not enrolled in this course"});
  }
  const foundCourse = await Course.findById(courseId);
  if(!foundCourse){
    return res.status(400).json({message: "Course not found"});
  }
  const enrolledCourse = foundUser.enrolledCourses.find(course => course.course == courseId);
  const course = {
    _id: foundCourse._id,
    name: foundCourse.name,
    instructor: foundCourse.instructor,
    thumbnail: foundCourse.thumbnail,
    description: foundCourse.description,
    enrolledAt: enrolledCourse.enrolledAt,
    completed: enrolledCourse.completed,
    completedAt: enrolledCourse.completedAt,
    dueDate: getDueDate(foundCourse.duration, enrolledCourse.enrolledAt),
    progress: getProgress(enrolledCourse.enrolledAt, foundCourse.duration, enrolledCourse.completed),
    schedule: foundCourse.schedule,
    location: foundCourse.location,
    prerequisites: foundCourse.prerequisites,
    syllabus: foundCourse.syllabus
  }

  return res.json({course});
};