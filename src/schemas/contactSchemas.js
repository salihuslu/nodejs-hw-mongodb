import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    favorite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(3).max(20),
    favorite: Joi.boolean(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
