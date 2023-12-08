const express = require("express");
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
const { 
    sanitizeRequestData, 
    validateUser,
    schemaValidator,
} = require("../shared/shared.middlewares");

// Schema validators
const {
    createEventCategorySchema,
    updateEventCategorySchema,
    createEventSchema,
    updateEventSchema,
} = require("./validators/event.validators");
const { 
    createTicketSchema, 
    updateTicketSchema,
} = require("./validators/ticket.validators");

const router = express.Router();

// Event categories routes
router.get("/categories", getCategories);
router.post("/categories",
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(createEventCategorySchema), 
    createCategory
);
router.patch("/categories/:id",
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(updateEventCategorySchema), 
    updateCategory
);
router.delete("/categories/:id", validateUser, deleteCategory);


// Event routes
router.get("/", getEvents);
router.get("/:id", getEvent);
router.get("/:id/publish", validateUser, publishEvent);
router.post("/", 
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(createEventSchema), 
    createEvent
);
router.patch("/:id", 
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(updateEventSchema), 
    updateEvent
);
router.delete("/:id", validateUser, deleteEvent);


// Event ticket routes
router.get("/:eventId/tickets", getEventTickets);
router.post("/:eventId/tickets", 
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(createTicketSchema), 
    createTicket
);
router.patch("/:eventId/tickets/:id",
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(updateTicketSchema), 
    updateTicket
);
router.delete("/tickets/:id", validateUser, deleteTicket);

module.exports = router