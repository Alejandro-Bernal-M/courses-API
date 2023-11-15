const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 50,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  hashPassword:{
    type: String,
    required: true
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: [],
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date,
        default: null
      }
    }
  ]
}, {timestamps: true});

UserSchema.virtual('password').set(function(password){
  this.hashPassword = bcrypt.hashSync(password, 12);
});

UserSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods = {
  authenticate: function(password){
    return bcrypt.compareSync(password, this.hashPassword );
  }
};

const User = mongoose.models.User ||  mongoose.model("User", UserSchema);
module.exports =  User;