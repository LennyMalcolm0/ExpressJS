const mongoose = require("mongoose");
const Schema = mongoose.Schema

const imageArraySchema = new Schema({
    _id: { 
        type: Schema.Types.ObjectId, 
        auto: true
    },
    url: { 
        type: String, 
        required: true,
    }
});

const InvalidReq = 401;
const InvalidResp = 404;
const FailedReq = 400;

module.exports = {
    imageArraySchema,
    InvalidReq,
    InvalidResp,
    FailedReq,
}