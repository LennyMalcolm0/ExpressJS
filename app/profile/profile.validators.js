const Joi = require('joi');
const { imageArraySchema } = require("../shared/shared.validators");

const createProfileSchema = Joi.object({
    userId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).lowercase().required(),
    dateOfBirth: Joi.date().greater(new Date).required(),
    gender: Joi.string().valid('Male', 'Female').required(),  
    bio: Joi.string().optional(),
    profilePictureUrl: Joi.string().required(),
    photos: Joi.array().items(imageArraySchema).optional(),
    interests: Joi.array().items(Joi.string()).required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    referredBy: Joi.string().optional(),
});

const updateProfileSchema = Joi.object({
    userId: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).lowercase().optional(),
    dateOfBirth: Joi.date().greater(new Date).optional(),
    gender: Joi.string().valid('Male', 'Female').optional(),  
    bio: Joi.string().optional(),
    profilePictureUrl: Joi.string().optional(),
    photos: Joi.array().items(imageArraySchema).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    referredBy: Joi.string().optional(),
});

module.exports = {
    createProfileSchema,
    updateProfileSchema,
}