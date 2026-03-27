const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    }
});

// usernameField: 'email' → login with email instead of username
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model('User', userSchema);


