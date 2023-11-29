const mongoose = require("mongoose");

const Schema = mongoose.Schema

const orderItems = new Schema({
    _id: { 
        type: Schema.Types.ObjectId, 
        auto: true
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    ticket: { 
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
}, { timestamps: true })

const ordersSchema = new Schema({
    paymentStatus: { type: String, required: true },
    paymentReference: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    eventOrganizer: { 
        type: Schema.Types.ObjectId, 
        ref: "Profile",
        required: true,
        immutable: true
    },
    profile: { 
        type: Schema.Types.ObjectId, 
        ref: "Profile",
        required: true,
        immutable: true
    },
    orderItems: { 
        type: [orderItems], 
        required: true,
    },
}, { timestamps: true })

const Order = mongoose.model("Order", ordersSchema);

module.exports = { Order, ordersSchema }