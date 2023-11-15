const Course = require('../models/course');
const User = require('../models/user');

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
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 courses per page

    const courses = await Course.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const filteredCourses = courses.map(course => {
      return {
        _id: course._id,
        name: course.name,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        description: course.description,
        enrollmentStatus: course.enrollmentStatus,
        duration: course.duration,
        schedule: course.schedule,
        location: course.location,
        prerequisites: course.prerequisites,
      };
    });

    return res.json({ filteredCourses, currentPage: page, coursesPerPage: perPage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getSpecificCourse = async(req, res) => {
  try {
    const courseId = req.params.id;
  
    const foundCourse = await Course.findById(courseId);
    
    if(foundCourse){
      const filteredCourse = {
        _id: foundCourse._id,
        name: foundCourse.name,
        instructor: foundCourse.instructor,
        thumbnail: foundCourse.thumbnail,
        description: foundCourse.description,
        enrollmentStatus: foundCourse.enrollmentStatus,
        duration: foundCourse.duration,
        schedule: foundCourse.schedule,
        location: foundCourse.location,
        prerequisites: foundCourse.prerequisites,
      }
      return res.json(filteredCourse);
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

    if(!foundUser){
      return res.status(404).json({message: "user doesn't exists"});
    }

    if(foundCourse.students.includes(userId)){
      return res.status(400).json({message: "user already enrolled"});
    }else {
      foundCourse.students.push(userId)
      try {
        foundUser.enrolledCourses.push({course: courseId});
        await foundUser.save();
        await foundCourse.save();
        console.log(foundUser)
        return res.json({ message: "Enrollment successful" });
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

exports.searchCourses = async(req, res) => {
  try {
    const searchQuery = req.query.q || ''; // Get the search query from the request

    const enrollmentStatus = req.query.enrollmentStatus || ''; // Optional enrollment status filter
    const courseDuration = req.query.courseDuration || ''; // Optional course duration filter

    // Construct the search filter based on provided query parameters
    const searchFilter = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for course name
        { instructor: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for instructor name
        { keywords: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search for keywords
      ]
    };

    // Apply optional filters
    if (enrollmentStatus) {
      searchFilter.enrollmentStatus = enrollmentStatus;
    }

    if (courseDuration) {
      searchFilter.duration = courseDuration;
    }

    const foundCourses = await Course.find(searchFilter);
    const filteredCourses = foundCourses.map(course => {
      return {
        _id: course._id,
        name: course.name,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        description: course.description,
        enrollmentStatus: course.enrollmentStatus,
        duration: course.duration,
        schedule: course.schedule,
        location: course.location,
        prerequisites: course.prerequisites,
      };
    });

    return res.json(filteredCourses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};