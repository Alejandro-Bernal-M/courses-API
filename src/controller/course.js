const Course = require('../models/course');
const User = require('../models/User');

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

exports.getCourses = async (req,res) => {
  const courses = await Course.find({});

  return res.json({courses});
}

exports.getSpecificCourse = async(req, res) => {
  try {
    const courseId = req.params.id;
  
    const foundCourse = await Course.findById(courseId);
    
    if(foundCourse){
      return res.json(foundCourse);
    }else{
      return res.status(404).json({message: "The course doesn't exists"})
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: 'Something went wrong', error});
  }
}

exports.enroll = async(req,res) => {
  try {
    const courseId = req.params.id;
    const userId = req.params.userId;
    
    const foundCourse = await Course.findById(courseId);
    const foundUser = await User.findById(userId);
    console.log(foundUser)

    if(!foundUser){
      return res.status(404).json({message: "user doesn't exists"});
    }

    if(foundCourse.students.includes(userId)){
      return res.status(400).json({message: "user already enrolled"});
    }else {
      foundCourse.students.push(userId)
      try {
        const updatedCourse = await foundCourse.save();
        return res.json(updatedCourse);
      } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Error updating the course"});
      }
    }
    
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "something went wrong", error});
  }
}