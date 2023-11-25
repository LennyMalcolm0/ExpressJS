const mongoose = require("mongoose");

const Schema = mongoose.Schema

const competitionSchema = new Schema({
    name: String,
    prizeMoney: Number
});

const profileSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        minLength: 2
    },
    club: { 
        type: String, 
        required: true,
    },
    age: { 
        type: Number, 
        required: true,
        min: 16,
        max: 45,
    },
    goals: { 
        type: Number, 
        required: true 
    },
    assists: Number,
    competition: [String],
}, { timestamps: true })

// playerSchema.methods.SayHello = function() {

// }

const Profile = mongoose.model("Profile", profileSchema);

module.exports = { Profile, profileSchema }