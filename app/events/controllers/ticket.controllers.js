const { Ticket, Event } = require("../event.models");
const mongoose = require("mongoose");

const getEventTickets = async (req, res) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(401).send({ error: "Event id not valid" });
    }

    try {
        const tickets = await Ticket.find({ eventId }).lean();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createTicket = async (req, res) => {
    const { eventId } = req.params;
    const payload = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(401).send({ error: "Event id not valid" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(401).send({ error: "Event does not exist" });
    }

    const ticket = await Ticket.findOne({
        eventId, 
        name: payload.name
    });
    if (ticket) {
        return res.status(401).send({ error: "Ticket name already exists for another ticket" });
    }

    try {
        const newTicket = await Ticket.create({ eventId, ...payload, sold: 0 });

        const tickets = [ ...event.tickets, newTicket._id ];
        await Event.findOneAndUpdate({ _id: eventId }, { tickets });
    
        res.status(200).send(newTicket);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateTicket = async (req, res) => {
    const { eventId, id } = req.params;
    const payload = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid ticket id" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }
    
    const ticket = await Ticket.findOne({
        _id: { $ne: id },
        eventId, 
        name: payload.name
    });
    if (ticket) {
        return res.status(401).send({ error: "Ticket name already exists for another ticket" });
    }

    try {
        delete payload.sold;

        const updatedTicket = await Ticket
            .findByIdAndUpdate(
                id,
                { ...payload },
                { new: true, lean: true }
            );
    
        if (!updatedTicket) {
            return res.status(404).send({ error: "Ticket not found" });
        }
    
        res.status(200).send(updatedTicket);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteTicket = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid ticket id" });
    }

    try {
        await Ticket.findByIdAndDelete(id);
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getEventTickets,
    createTicket,
    updateTicket,
    deleteTicket,
}