const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    max: 200,
    min: 10,
    trim: true,
    required: true
  },
  enrollmentStatus:{
    type: String,
    enum: ['Open', 'Closed', 'InProgress'],
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  prerequisites: [
    {
      type: String
    }
  ],
  syllabus: [
    {
      week: Number,
      topic: String,
      content: String
    }
  ],
  students: [
    {
      type: mongoose.Types.ObjectId, ref: 'User'
    }
  ],
  keywords: [
    {
      type: String
    }
  ]
});

const Course = mongoose.models.Course ||  mongoose.model('Course', CourseSchema);
module.exports = Course