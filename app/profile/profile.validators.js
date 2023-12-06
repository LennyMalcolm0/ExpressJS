const Joi = require('joi');
const { imageArraySchema } = require("../shared/shared.validators");

const createProfileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).lowercase().required(),
    dateOfBirth: Joi.string().custom((value, helpers) => {
        const formattedDate = new Date(value);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        if (formattedDate <= eighteenYearsAgo) {
            return value;
        } else {
            return helpers.message({ custom: 'Date is not at least 18 years ago!' });
        }
    }).required(),
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
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).lowercase().optional(),
    dateOfBirth: Joi.string().custom((value, helpers) => {
        const formattedDate = new Date(value);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        if (formattedDate <= eighteenYearsAgo) {
            return value;
        } else {
            return helpers.message({ custom: 'Date is not at least 18 years ago!' });
        }
    }).optional(),
    gender: Joi.string().valid('Male', 'Female').optional(),  
    bio: Joi.string().optional(),
    profilePictureUrl: Joi.string().optional(),
    photos: Joi.array().items(imageArraySchema).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    referredBy: Joi.string().optional(),
});

module.exports = { createProfileSchema, updateProfileSchema }