const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{type: String,
        required:true,
    },
    description:String,

    image: {
        url: String,
        filename: String,

    },
    // image: {
    //     filename: { type: String, default: 'default_image_name' },
    //     url: { 
    //         type: String,
    //         default: "https://www.istockphoto.com/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background-gm1127245421-297029234?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Ffree-images&utm_medium=affiliate&utm_source=unsplash&utm_term=free+images%3A%3A%3A",
    //         set: (v) => v === "" ? "https://www.istockphoto.com/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background-gm1127245421-297029234?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Ffree-images&utm_medium=affiliate&utm_source=unsplash&utm_term=free+images%3A%3A%3A" : v
    //     }
    // },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;