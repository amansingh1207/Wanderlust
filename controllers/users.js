const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");


module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
};


module.exports.signUp = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome to Wanderlust You are logged in!");
    let redirectUrl = res.locals.redirectUrl;
    // 🛡️ Check for DELETE or unsafe redirect
    if (!redirectUrl || redirectUrl.includes("_method=DELETE") || redirectUrl.includes("/reviews")) {
      redirectUrl = "/listings";
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};