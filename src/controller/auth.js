const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const foundUser = await User.findOne({email: req.body.email});

  if(foundUser){
    return res.status(400).json({message: 'User already exists'});
  }else {
    try {
      const {firstName, lastName, email, password, adminPassword, role} = req.body;
      const newUser = new User({
        firstName,
        lastName,
        email,
        password
      });

      if(role){
        if(adminPassword == process.env.ADMIN_PASSWORD){
          newUser.role = role;
        }else {
          return res.status(400).json({message: "Wrong admin password"})
        }
      }

      const savedUser = await newUser.save();

      if(savedUser == newUser){
        return res.json({savedUser});
      }else {
        return res.status(400).json({message: 'Error saving the user'});
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({message: 'Something went wrong', errors: error.errors})
    }
  }
}

exports.signin = async (req, res) => {
  try {
    const foundUser = await User.findOne({email: req.body.email});
    if(!foundUser) return res.status(400).json({message: "Incorrect email or password"});

    if(foundUser.authenticate(req.body.password)){
      const token = jwt.sign({_id: foundUser._id, role: foundUser.role}, process.env.JWT_SECRET, {expiresIn: '2h'});
      const {_id, firstName, lastName, email, role, fullName } = foundUser;

      return res.status(200).json({
        token,
        user: {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName
        }
      })
    }else {
      return res.status(400).json({message: "Invalid email or password"});
    }
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Something went wrong"});
  }
}