const { Event, Ticket, Category } = require("../event.models");
const mongoose = require("mongoose");

const getEvents = async (req, res) => {
    try {
        const events = await Event
            .find({ startDate: { $lt: new Date() }, published: true })
            .populate("organizer tickets")
            .populate({ path: 'category', select: 'name mainCategory' })
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
            .populate("category organizer tickets")
            .lean();
        
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

    const category = await Category.findById(payload.category);
    if (!category) {
        return res.status(401).send({ error: "Event category does not exist." });
    }

    try {
        const tickets = payload.tickets;
        delete payload.tickets
        const event = await Event.create({ ...payload, published: false });

        // console.log(event)
        const createdTickets = await Promise.all(tickets.map(ticket => {
            return Ticket.create({ eventId: event._id, ...ticket, sold: 0 })
        }))

        let ticketIds = []
        for (const ticket of createdTickets) {
            ticketIds.push(ticket._id)
        }

        const eventWithTickets = await Event
            .findOneAndUpdate(
                { _id: event._id },
                { tickets: ticketIds },
                { new: true, lean: true }
            );
    
        res.status(200).send(eventWithTickets);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid event id" });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }
    if (payload.category) {
        const category = await Category.findById(payload.category);
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
                { new: true, runValidators: true, lean: true }
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

const publishEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Invalid event id" });
    }

    try {
        const publishedEvent = await Event
            .findByIdAndUpdate(
                id,
                { published: true },
                { new: true, lean: true }
            );
            
        if (!publishedEvent) {
            return res.status(404).send({ error: "Event not found" });
        }
    
        res.status(200).send(publishedEvent);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
}