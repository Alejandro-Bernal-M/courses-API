const Course = require('../models/course');
const User = require('../models/User');

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

function getProgress(enrolledAt, duration) {
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
      progress: getProgress(course.enrolledAt, course.course.duration)
    }
  });
  return res.json({courses});
};