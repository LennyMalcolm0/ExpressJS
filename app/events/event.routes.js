const express = require("express");
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("./controllers/category.controllers");
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
} = require("./controllers/event.controllers");
const {
    getEventTickets,
    createTicket,
    updateTicket,
    deleteTicket,
} = require("./controllers/ticket.controllers");

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/", getEvents);
router.get("/:id", getEvent);
router.get("/:id/publish", publishEvent);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

router.get("/:eventId/tickets", getEventTickets);
router.post("/:eventId/tickets", createTicket);
router.put("/:eventId/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);

module.exports = router