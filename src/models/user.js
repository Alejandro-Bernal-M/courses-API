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
  }
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

module.exports = mongoose.model('User', UserSchema);
