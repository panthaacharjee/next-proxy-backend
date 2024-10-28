const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerUser, loginUser, logout,  getUserDetails } = require("../controllers/userController");


/* ====================== USER AUTHENTICATION ======================= */
router.route("/register/user").post(registerUser)
router.route("/login/user").post(loginUser)
router.route("/logout").get(logout)
router.route("/profile/me").get(isAuthenticatedUser, getUserDetails)

module.exports = router