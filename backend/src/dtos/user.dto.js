const Joi = require('joi');

const registerSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().min(18),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
    firstname: Joi.string().min(2).max(20),
    lastname: Joi.string().min(2).max(20),
    age: Joi.number().min(18)
});

const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});

module.exports = { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema };