const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb+srv://Aman_Singh:Aman2006@cluster0.tn5mi3p.mongodb.net/wanderlust?appName=Cluster0";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    let user = await User.findOne({});
    if (!user) {
        user = await User.register(
            new User({ email: "admin@wanderlust.com", username: "admin" }),
            "admin@123"
        );
        console.log(`Default user created — email: admin@wanderlust.com, password: admin@123`);
    }
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: user._id}));
    await Listing.insertMany(initData.data);
    console.log(`Data was initialised with owner: ${user.username} (${user._id})`);
    mongoose.disconnect();
};

initDB();
