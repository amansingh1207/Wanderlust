const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}); //cloudinary ke storage mein save ho rha hai



// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create
router.post("/", isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createNewListing));
// router.post("/", upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// Update
router.put("/:id", isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

// Delete
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
