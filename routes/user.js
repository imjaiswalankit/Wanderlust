const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
.get(userController.renderSignupForm) // Signup material  get Route 
.post(wrapAsync(userController.signup));// signup route for post

router.route("/login")
.get( userController.renderLoginForm)  // login material get route req
.post( saveRedirectUrl ,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),userController.login);// login route For Post

// LogOut Material
router.get("/logout",userController.logout)

module.exports = router;