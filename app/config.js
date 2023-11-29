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

const dynamicReferences = new Schema({
    doc: {
        type: Schema.Types.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `docModel` property to find the right model.
        refPath: 'docModel'
    },
    docModel: {
        type: String,
        required: true,
        enum: ['BlogPost', 'Product']
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