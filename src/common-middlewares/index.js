const jwt = require('jsonwebtoken');

exports.requireSignin = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
   return res.status(401).json({message: 'Authorization required'})
  }
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({error: error, message: 'Token error'});
  }
  req.user = user;
  console.log('user',user)
  next();
}

exports.adminMiddleware = (req, res, next) => {
  if(req.user.role != 'admin'){
    return res.status(400).json({message: 'Access denied'})
  };
  next();
}

exports.userMiddleware = (req, res, next) => {
  if(req.user.role != 'user'){
    return res.status(400).json({message: 'Access denied'})
  };
  next();
}