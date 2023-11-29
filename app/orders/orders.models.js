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
    paymentStatus: { 
        type: String, 
        required: true,
        enum: ["PENDING", "COMPLETED", "FAILED"]
    },
    totalPrice: { type: Number, required: true },
    event: { 
        type: Schema.Types.ObjectId, 
        ref: "Event",
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

// Always attach `populate()` to `find()` calls.
// ordersSchema.post("find", async function(orders) {
//     for (const order of orders) {
//         if (order.paymentStatus === "COMPLETED") {
//             await order.populate("-profile");
//         }
//     }
// });

const Order = mongoose.model("Order", ordersSchema);

module.exports = { Order, ordersSchema }