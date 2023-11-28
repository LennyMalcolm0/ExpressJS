const { Ticket } = require("../event.models");
const mongoose = require("mongoose");

const getEventTickets = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Event id not valid" });
    }

    try {
        const tickets = await Ticket.find({ eventId: id }).lean();
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
        $or: [{ name: payload.name }, { description: payload.description }] 
    });
    if (ticket) {
        return res.status(401).send({ error: "Ticket name or description already exists for another ticket" });
    }

    try {
        const newTicket = await Ticket.create({ eventId, ...payload });
    
        res.status(200).send(newTicket);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateTicket = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }
    
    const ticket = await Ticket.findOne({
        eventId, 
        _id: { $ne: id },
        $or: [{ name: payload.name }, { description: payload.description }] 
    });
    if (ticket) {
        return res.status(401).send({ error: "Ticket name or description already exists for another ticket" });
    }

    try {
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
        return res.status(401).send({ error: "Not a valid id" });
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