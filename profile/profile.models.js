const mongoose = require("mongoose");

const Schema = mongoose.Schema

const imageArraySchema = new Schema({
    url: { 
        type: String, 
        required: true
    }
});

const profileSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { 
        type: String, 
        required: true,
        match: /^[a-zA-Z0-9_]+$/,
        lowercase: true
    },
    dateOfBirth: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(date) {
                const eighteenYearsAgo = new Date();
                eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                return date >= eighteenYearsAgo;
            },
            message: "Date is not at least 18 years ago!"
        }
    },
    gender: { type: String, required: true },
    bio: { type: String, required: true },
    profilePictureUrl: { type: String, required: true },
    photos: { type: [imageArraySchema], required: true },
    interests: { type: [String], required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    referredBy: { type: String, required: false },
    referralCode: { 
        type: String, 
        required: false,
        unique: true 
    },
}, { timestamps: true })

const Profile = mongoose.model("Profile", profileSchema);

module.exports = { Profile, profileSchema }
