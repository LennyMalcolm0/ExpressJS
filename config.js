const mongoose = require("mongoose");

const imageArraySchema = new mongoose.Schema({
    id: { type: Schema.Types.ObjectId, auto: true },
    url: { 
        type: String, 
        required: true,
        unique: true
    }
});

const InvalidReq = 401;
const InvalidResp = 404;
const FailedReq = 400;

const cleanUpObject = (object) => {
    const { __v, _id, ...main } = object;
    main.id = _id;
    return main;
}

module.exports = {
    imageArraySchema,
    InvalidReq,
    InvalidResp,
    FailedReq,
    cleanUpObject,
}