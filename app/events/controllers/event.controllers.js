const { Event, Ticket } = require("../event.models");
const mongoose = require("mongoose");

const getEvents = async (req, res) => {
    try {
        const events = await Event
            .find({ startDate: { $gt: new Date() } })
            .populate("category")
            .lean();
        res.status(200).send(events);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Event id not valid" });
    }

    try {
        const event = await Event
            .findById(id)
            .populate("category")
            .lean();
        const tickets = await Ticket.find({ eventId: id }).lean();
        event.tickets = tickets;
        
        res.status(200).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createEvent = async (req, res) => {
    const payload = req.body;
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    const category = await Ticket.findById(payload.category);
    if (!category) {
        return res.status(401).send({ error: "Event category does not exist." });
    }

    try {
        const event = await Event.create({ ...payload });
    
        res.status(200).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }
    if (payload.category) {
        const category = await Ticket.findById(payload.category);
        if (!category) {
            return res.status(401).send({ error: "Event category does not exist." });
        }
    }
    
    const event = await Event.findById(id);
    if (!event) {
        return res.status(404).send({ error: "Event not found" });
    }

    const totalTicketsSold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
    if (totalTicketsSold > 0) {
        delete payload.startDate;
    }

    try {
        const updatedEvent = await Event
            .findByIdAndUpdate(
                id,
                { ...payload },
                { new: true, lean: true }
            );
    
        if (!updatedEvent) {
            return res.status(404).send({ error: "Event not found" });
        }
    
        res.status(200).send(updatedEvent);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }

    const event = await Event.findById(id);
    if (!event) {
        return res.status(404).send({ error: "Event not found" });
    }
    const totalTicketsSold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0);

    if (totalTicketsSold > 0) {
        try {
            await Event.findByIdAndDelete(id);
            res.status(200).send("Success");
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        return res.status(404).send({ error: "Can't delete event! Already sold Ticket." });
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
}