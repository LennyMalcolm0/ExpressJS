const Joi = require('joi');

const imageArraySchema = Joi.object({
    url: Joi.string().required(),
});

module.exports = {
    imageArraySchema
}