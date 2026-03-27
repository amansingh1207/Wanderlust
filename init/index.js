const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68428b99ca5e3cb07f6b12ba"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");

};

initDB();
