const Course = require('../models/course');

exports.createCourse = async(req, res) => {
  const {
    name,
    instructor,
    description,
    enrollmentStatus,
    schedule,
    duration,
    location,
    prerequisites,
    syllabus,
    students
  } = req.body;

  const newCourse = new Course({
    name,
    instructor,
    description,
    enrollmentStatus,
    thumbnail: req.file.filename,
    duration,
    schedule,
    location,
    prerequisites,
    syllabus,
    students
  });

  try {
    const savedCourse = await newCourse.save();

    if(savedCourse == newCourse){
     return res.status(200).json(savedCourse)
    }else {
      return res.status(400).json({message: "Error saving the course"})
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Error saving the course", error: error})
  }
};