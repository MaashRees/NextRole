const Joi = require('joi');

const createApplicationSchema = Joi.object({
    jobId: Joi.string().hex().length(24).required(),
    status: Joi.string().valid('En attente', 'Postulé', 'Entretien', 'Test Technique', 'Offre', 'Refusé').default('En attente'),
    appliedDate: Joi.date().default(Date.now),
    notes: Joi.string().trim().allow('')
});

const addFollowUpSchema = Joi.object({
    date: Joi.date().default(Date.now),
    note: Joi.string().trim().allow('')
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('En attente', 'Postulé', 'Entretien', 'Test Technique', 'Offre', 'Refusé').required()
});

module.exports = { createApplicationSchema, addFollowUpSchema, updateStatusSchema };