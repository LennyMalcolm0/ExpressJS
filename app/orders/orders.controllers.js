const { Order } = require("./orders.models");
const { Profile } = require("../profile/profile.models");
const { Event, Ticket } = require("../events/event.models");
const mongoose = require("mongoose");
const { getQueryParameters } = require("../shared/utils");

const getUserOrders = async (req, res) => {
    const userId = req.currentUser.uid;
    const { 
        limit, 
        skip, 
        filterParameters 
    } = getQueryParameters(req);
    
    const profile = await Profile.findOne({ userId }).select("_id");
    if (!profile) {
        return res.status(404).send({ error: "Couldn't extract your profile" });
    }

    try {
        const orders = await Order
            .find({ profile: profile._id, ...filterParameters })
            .skip(skip)
            .limit(limit)
            .populate({ 
                path: "event", 
                select: "name flyerUrl startDate organizer",
                populate: { 
                    path: "organizer", 
                    select: "firstName lastName profilePictureUrl" 
                }
            })
            .populate({ 
                path: "orderItems", 
                populate: { 
                    path: "ticket", 
                    select: "name",
                }
            })
            .lean();
    
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createOrder = async (req, res) => {
    const userId = req.currentUser.uid;
    const { eventId } = req.params;
    const { payload } = req.body;

    if (!payload[0]._id || !payload[0].quantity) {
        return res.status(401).send({ error: "Invalid payload" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(401).send({ error: `Invalid event id` });
    }

    const event = await Event.findById(eventId).select("name");
    if (!event) {
        return res.status(401).send({ error: "Event not found" });
    }

    const profile = await Profile.findOne({ userId }).select("_id");
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
        profile: profile._id,
        orderItems,
    }

    const completeTicketsPurchase = async (newOrder) => {
        try {
            const completedOrder = await Order
                .findByIdAndUpdate(
                    newOrder._id, 
                    { paymentStatus: "COMPLETED" },
                    { new: true, lean: true }
                );
    
            res.status(200).send(completedOrder);
        } catch (error) {
            await Promise.all(payload.map(ticket => {
                return Ticket.findByIdAndUpdate(
                    ticket._id,
                    { $inc: { sold: -ticket.quantity } }
                )
            }))
            
            res.status(400).send(error);
        }
    };

    try {
        const newOrder = await Order.create({ ...requestBody });

        try {
            await Promise.all(payload.map(ticket => {
                return Ticket.findByIdAndUpdate(
                    ticket._id,
                    { $inc: { sold: ticket.quantity } }
                )
            }))

            await completeTicketsPurchase(newOrder);
        } catch {
            res.status(400).send("Purchase unsuccessful");
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = { getUserOrders, createOrder }