const Joi = require('joi');

const createTicketSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
});

const updateTicketSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    quantity: Joi.number().optional(),
});

module.exports = { createTicketSchema, updateTicketSchema }