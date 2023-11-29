const { Order } = require("./orders.models");
const { Profile } = require("../profile/profile.models");
const { Event, Ticket } = require("../events/event.models");
const mongoose = require("mongoose");

const getUserOrders = async (req, res) => {
    const { profileId } = req.params;
    try {
        const orders = await Order
            .find({ profile: profileId })
            .populate({ 
                path: "event", 
                select: "name flyerUrl startDate organizer",
                populate: { 
                    path: "organizer", 
                    select: "firstName lastName profilePictureUrl" 
                }
            })
            .lean();
    
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createOrder = async (req, res) => {
    const { eventId, profileId } = req.params;
    const { payload } = req.body;

    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    const invalidEventId = !mongoose.Types.ObjectId.isValid(eventId);
    const invalidProfileId = !mongoose.Types.ObjectId.isValid(profileId);
    if (invalidEventId || invalidProfileId) {
        return res.status(401).send({ 
            error: `Invalid ${invalidEventId ? "event" : "profile"} id` 
        });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(401).send({ error: "Event not found" });
    }

    const profile = await Profile.findById(profileId);
    if (!profile) {
        return res.status(401).send({ error: "Profile not found" });
    }

    let totalPrice = 0;
    let orderItems = [];
    for (const ticketObject of payload) {
        const ticket = await Ticket.findById(ticketObject._id);
        if (!ticket) {
            return res.status(401).send({ error: `Invalid ticket id` });
        }
        const ticketsRemaining = ticket.quantity - ticket.sold;

        if (ticketObject.quantity > ticketsRemaining) {
            return res.status(401).send({ 
                error: `Only ${ticketsRemaining} tickets remains for the ${ticket.name} category` 
            });
        }

        totalPrice += ticketObject.quantity * ticket.price;
        orderItems.push({
            quantity: ticketObject.quantity,
            price: ticketObject.quantity * ticket.price,
            ticket: ticket._id
        })
    }

    const requestBody = {
        paymentStatus: "PENDING",
        totalPrice,
        event: eventId,
        profile: profileId,
        orderItems,
    }

    try {
        const newOrder = await Order.create({ ...requestBody });

        try {
            await Promise.all(payload.map(ticket => {
                return Ticket.findByIdAndUpdate(
                    ticket._id,
                    { $inc: { sold: ticket.quantity } }
                )
            }))

            const completedOrder = await Order
                .findByIdAndUpdate(
                    newOrder._id, 
                    { paymentStatus: "COMPLETED" },
                    { new: true, lean: true }
                );
    
            res.status(200).send(completedOrder);
        } catch {
            res.status(400).send("Purchase unsuccessful");
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getUserOrders,
    createOrder,
}