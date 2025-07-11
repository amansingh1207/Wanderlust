const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);//This line of code does salting hashing and saving the data in db
module.exports = mongoose.model('User', userSchema);


