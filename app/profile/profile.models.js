const mongoose = require("mongoose");
const { imageArraySchema } = require("../shared/shared.models");

const Schema = mongoose.Schema

const profileSchema = new Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { 
        type: String, 
        required: true,
        match: /^[a-zA-Z0-9_]+$/,
        lowercase: true
    },
    dateOfBirth: { 
        type: String, 
        required: true,
        validate: {
            validator: function(date) {
                const formattedDate = new Date(date);
                const eighteenYearsAgo = new Date();
                eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                return formattedDate <= eighteenYearsAgo;
            },
            message: "Date is not at least 18 years ago!"
        }
    },
    gender: { 
        type: String, 
        required: true,
        enum: ["Male", "Female"]
    },
    bio: { type: String, required: true },
    profilePictureUrl: { type: String, required: true },
    photos: { type: [imageArraySchema], required: true },
    interests: { type: [String], required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    referredBy: { type: String, required: false },
}, { timestamps: true })

const Profile = mongoose.model("Profile", profileSchema);

module.exports = { Profile, profileSchema }
