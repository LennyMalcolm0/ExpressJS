const mongoose = require("mongoose");
const { imageArraySchema } = require("../config");

const Schema = mongoose.Schema

const eventCategorySchema = new Schema({
    name: { type: String, required: true },
    mainCategory: { type: String, required: true },
}, { timestamps: true })

const ticketSchema = new Schema({
    eventId: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: "Event"
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    // sold: { type: Number, required: false }
}, { timestamps: true })

const eventSchema = new Schema({
    name: { type: String, required: true },
    category: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: "Category"
    },
    startDate: { 
        type: String, 
        required: true,
        validate: {
            validator: function(date) {
                const formattedDate = new Date(date);
                const today = new Date();
                return today < formattedDate;
            },
            message: "Date must be today or in the future!"
        }
    },
    organizer: { 
        type: Schema.Types.ObjectId, 
        ref: "Profile",
        required: true,
        immutable: true
    },
    flyerUrl: { type: String, required: true },
    otherImages: { type: [imageArraySchema], required: false },
}, { timestamps: true })

const Event = mongoose.model("Event", eventSchema);
const Category = mongoose.model("Category", eventCategorySchema);
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = { 
    Event, 
    Category, 
    Ticket, 
    eventSchema, 
    eventCategorySchema, 
    ticketSchema, 
}