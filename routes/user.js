const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//signup
router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signUp));


//login
router.get("/login", userController.renderLoginForm );

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,

}), userController.login);

//logout
router.get("/logout", userController.logout);


module.exports = router;