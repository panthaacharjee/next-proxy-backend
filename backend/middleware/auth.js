const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

/* =========== MODEL IMPORTS ================ */
const User = require("../models/userModel");



exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const  {token} =   req.cookies; //req.headers["authorization"] ||
  if (!token) {
    next(new ErrorHandler("", 401));
  } else {
    const bearer = token.split(",")
    const decodeData = jwt.verify(bearer[0], process.env.JWT_SECRET);

    if(bearer[1]==="USER"){
      req.user = await User.findById(decodeData.id);
    }else{
      next(new ErrorHandler("Please Contact With Adminstration", 401));
    }
  }
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
