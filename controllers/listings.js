const Listing = require("../models/listing.js");

async function geocodeListing(location, country) {
    try {
        const query = encodeURIComponent(`${location}, ${country}`);
        const url = `https://api.maptiler.com/geocoding/${query}.json?key=${process.env.MAP_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].geometry.coordinates; // [lng, lat]
        }
    } catch (e) {
        console.log("Geocoding failed:", e.message);
    }
    return null;
}

module.exports.index = async (req, res) => {
    const { q } = req.query;
    let allListings;
    if (q && q.trim() !== "") {
        const regex = new RegExp(q.trim(), "i");
        allListings = await Listing.find({
            $or: [{ title: regex }, { location: regex }, { country: regex }]
        });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, searchQuery: q || "" });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author",},}).populate("owner");
    // console.log("Listing Owner:", listing.owner);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing, mapApiKey: process.env.MAP_API_KEY });
};

module.exports.createNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    const coords = await geocodeListing(newListing.location, newListing.country);
    if (coords) {
        newListing.geometry = { type: "Point", coordinates: coords };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

// module.exports.createNewListing = async (req, res) => {
//     const { location } = req.body.listing;
//     const geoData = await geocodeLocation(location);

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     if (geoData) {
//         newListing.geometry = {
//             type: "Point",
//             coordinates: [geoData.longitude, geoData.latitude]
//         };
//     }

//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     await newListing.save();
//     req.flash("success", "New listing created with geocoding!");
//     res.redirect("/listings");
// };

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }

    const coords = await geocodeListing(req.body.listing.location, req.body.listing.country);
    if (coords) {
        listing.geometry = { type: "Point", coordinates: coords };
    }

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

