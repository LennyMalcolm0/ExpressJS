const mongoose = require("mongoose");

const Schema = mongoose.Schema

const competitionSchema = new Schema({
    name: String,
    prizeMoney: Number
});

const playerSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        minLength: 2
    },
    club: { 
        type: String, 
        required: true,
        // lowercase: true,
        // immutable: true
    },
    age: { 
        type: Number, 
        required: true,
        min: 16,
        max: 45,
        // validator: {
        //     validator: v => v % 2 === 0,
        //     message: props => `${props.value} is not an even number`
        // }
    },
    goals: { 
        type: Number, 
        required: true 
    },
    assists: Number,
    competition: [String],
    favplayer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Player"
    }
}, { timestamps: true })

// playerSchema.methods.SayHello = function() {

// }

const Player = mongoose.model("Player", playerSchema);

module.exports = { Player, playerSchema }

// {
// 	"name": "Kevin De Bruyne",
// 	"club": "Manchester City",
// 	"age": 23,
// 	"goals": 24,
// 	"assists": 35,
// 	"competition": ["EPL", "UEFA"]
// }