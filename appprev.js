const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} =  require("./schema.js");
const Review = require("./models/review.js");

const userRouter = require("./routes/user.js");

const session = require("express-session");

const sessionOptions = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));  //sara data jo aa rha hai wo parse ho jaye
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req,res) => {
    res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
      let {error} = listingSchema.validate(req.body); //for joi schema validator to validate
    // console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

const validateReview = (req, res, next) => {
      let {error} = reviewSchema.validate(req.body); //for joi schema validator to validate
        // console.log(error);    
      if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};






// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "Bye the beach",
//         price: 1200,
//         location: "Delhi",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize()); //a middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//serialize means storing the data related to user
passport.deserializeUser(User.deserializeUser());//serialize means unstoring the data related to user




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Demo for password
app.get("/demouser", async (req,res) => {
    let fakeUser = new User ({
        email: "student@gmail.com",
        username: "Gaurav Rathore"
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});



//Index Route
app.get("/listings",wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
} ));

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("./listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "listing you requested does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
        // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body;
    // console.log(listing);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (!listing) {
        req.flash("error", "listing you requested does not exists!");
        res.redirect("/listings");
    }
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");

}));

//Reviews
//POST Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

//Error handling middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`server is listening to the port: ${port}`);
});
