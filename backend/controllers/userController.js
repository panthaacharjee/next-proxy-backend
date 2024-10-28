const crypto = require("crypto")
const cloudinary = require("cloudinary");
const { isNumeric } = require("validator");
const uuid = require("uuid")



/* ================= UTILS AND MIDDLEWARE ==================== */
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const ApiFetaures = require("../utils/apifetures");




/* ============ MODELS IMPORT ============== */
const User  = require("../models/userModel")





/* ===================================================================================================== */
/* ============================= REGISTER USER (POST) (/register/user) ================================= */
/* ===================================================================================================== */

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const emailUser = await User.findOne({ email });

    if (emailUser) {
      return next(new ErrorHandler("THIS USER EMAIL ALREADY EXIST", 400));
    }
    
    const user = await User.create({
      name,
      email,
      password, 
    });
    sendToken(user, 201, res, "USER");
  });


/* ===================================================================================================== */
/* ================================ LOGIN USER (POST) (/login/user) ==================================== */
/* ===================================================================================================== */

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email | !password) {
      return next(new ErrorHandler("PLEASE ENTER EMAIL & PASSWORD", 400));
    }
    
    let user;

    if(req.body.role==="USER"){
       user = await User.findOne({ email }).select("+password")
    }else if (req.body.role === "ADMIN"){
       user = await Admin.findOne({email}).select("+password")
    }else{
      return next(new ErrorHandler("PLEASE CONTACT WITH ADMINISTRATION", 401));
    }
  
    if (!user) {
      return next(new ErrorHandler("PLEASE ENTER VALID EMAIL OR PASSWORD", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("PLEASE ENTER VALID EMAIL OR PASSWORD", 401));
    }
    sendToken(user, 200, res, req.body.role)
  });

/* ===================================================================================================== */
/* ============================= LOGOUT USER (GET) (/logout) ================================= */
/* ===================================================================================================== */

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "LOG OUT",
    });
  });

  
/* ===================================================================================================== */
/* ========================== USER PROFILE (GET) (/profile/me) ============================ */
/* ===================================================================================================== */
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const  user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user,
  });
});