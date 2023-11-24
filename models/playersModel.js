const mongoose = require("mongoose");

const Schema = mongoose.Schema

const competitionSchema = new Schema({
    name: String,
    prizeMoney: Number
});

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    goals: {
        type: Number,
        required: true
    },
    assists: {
        type: Number,
        required: false
    },
    competition: {
        type: [String],
        required: false
    },
}, { timestamps: true })

module.exports = mongoose.model("Player", playerSchema);

// {
// 	"name": "Kevin De Bruyne",
// 	"club": "Manchester City",
// 	"age": 23,
// 	"goals": 24,
// 	"assists": 35,
// 	"competition": ["EPL", "UEFA"]
// }