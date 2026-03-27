require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://Aman_Singh:Aman2006@cluster0.tn5mi3p.mongodb.net/wanderlust?appName=Cluster0";

async function geocode(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    const url = `https://api.maptiler.com/geocoding/${query}.json?key=${process.env.MAP_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates; // [lng, lat]
    }
    return null;
}

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const listings = await Listing.find({
        $or: [
            { geometry: { $exists: false } },
            { "geometry.coordinates": { $exists: false } },
            { "geometry.coordinates": { $size: 0 } }
        ]
    });
    console.log(`Found ${listings.length} listings without coordinates`);

    for (let listing of listings) {
        const coords = await geocode(listing.location, listing.country);
        if (coords) {
            listing.geometry = { type: "Point", coordinates: coords };
            await listing.save();
            console.log(`✓ ${listing.title} → [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);
        } else {
            console.log(`✗ Could not geocode: ${listing.title}`);
        }
    }

    console.log("Done! All listings geocoded.");
    await mongoose.disconnect();
}

main().catch(console.error);
