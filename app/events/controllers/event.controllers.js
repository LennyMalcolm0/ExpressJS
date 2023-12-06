const { Event, Ticket, Category } = require("../event.models");
const { Profile } = require("../../profile/profile.models")
const mongoose = require("mongoose");
const { getQueryParameters } = require("../../shared/utils");

const getEvents = async (req, res) => {
    const { limit, skip, filterParameters } = getQueryParameters(req);

    try {
        const events = await Event
            .find({ 
                startDate: { $lt: new Date() }, 
                published: true,
                ...filterParameters,
                // "organizer.firstName": { $eq: "Jake" }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: "category", select: "name" })
            .populate({ path: "organizer", select: "firstName lastName profilePictureUrl" })
            .populate({ path: "tickets", select: "price quantity sold" })
            .select("-otherImages")
            // .populate({ 
            //     path: "tickets", 
            //     match: { $expr: { $ne: ["$quantity", "$sold"] } },
            // })startDate_gt_2024-01-05T06:00:00.000Z,name_eq_Music Festival
            .lean();

        const hasMore = events.length === Number(limit);
        
        res.status(200).send({ events, hasMore });
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
            .populate("organizer tickets")
            .populate({ path: "category", select: "name" })
            .lean();
            
        if (!event) {
            return res.status(404).send({ error: "Event not found" });
        }
        
        res.status(200).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createEvent = async (req, res) => {
    const userId = req.currentUser.uid;
    const payload = req.body;

    const category = await Category.findById(payload.category);
    if (!category) {
        return res.status(401).send({ error: "Event category does not exist." });
    }

    const profile = await Profile.findOne({ userId }).lean();
    if (!profile) {
        return res.status(404).send({ error: "Couldn't extract your profile" });
    }

    try {
        const tickets = payload.tickets;
        delete payload.tickets;

        const event = await Event.create({ 
            ...payload, 
            organizer: profile._id, 
            published: false 
        });

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

// TODO: Segment tickets and events delete logic
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }

    const event = await Event.findById(id).select("tickets").populate("tickets");
    if (!event) {
        return res.status(404).send({ error: "Event not found" });
    }
    const totalTicketsSold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0);

    if (totalTicketsSold === 0) {
        try {
            await Ticket.deleteMany({ eventId: id });
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