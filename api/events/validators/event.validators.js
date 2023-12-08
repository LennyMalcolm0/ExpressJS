const Joi = require('joi');
const { imageArraySchema } = require("../../shared/shared.validators");
const { createTicketSchema } = require("./ticket.validators");

const createEventCategorySchema = Joi.object({
    name: Joi.string().required(),
    mainCategory: Joi.string().required(),
});
const updateEventCategorySchema = Joi.object({
    name: Joi.string().optional(),
    mainCategory: Joi.string().optional(),
});

const createEventSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    startDate: Joi.string().custom((value, helpers) => {
        const formattedDate = new Date(value);
        const today = new Date();
        if (today < formattedDate) {
            return value;
        } else {
            return helpers.message({ custom: 'Date must be today or in the future!' });
        }
    }).required(),
    flyerUrl: Joi.string().required(),
    otherImages: Joi.array().items(imageArraySchema).optional(),
    tickets: Joi.array().items(createTicketSchema).required(),
});  

const updateEventSchema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    startDate: Joi.string().custom((value, helpers) => {
        const formattedDate = new Date(value);
        const today = new Date();
        if (today < formattedDate) {
            return value;
        } else {
            return helpers.message({ custom: 'Date must be today or in the future!' });
        }
    }).optional(),
    flyerUrl: Joi.string().optional(),
    otherImages: Joi.array().items(imageArraySchema).optional(),
});  

module.exports = {
    createEventCategorySchema,
    updateEventCategorySchema,
    createEventSchema,
    updateEventSchema,
}