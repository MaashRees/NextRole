const Joi = require('joi');

const contactInSchema = Joi.object({
    name: Joi.string().trim().required(),
    position: Joi.string().trim().allow(''),
    phone: Joi.string().regex(/^\+\d{1,3}\d{9,10}$/).message("Le format du téléphone est invalide (ex: +33612345678)"),
    email: Joi.string().email().lowercase().trim().allow(''),
    linkedin: Joi.string().trim().allow('')
});

const jobSchema = Joi.object({
  title: Joi.string().trim().required(),
  company: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  salary: Joi.object({
      mini: Joi.number().min(0).default(0),
      maxi: Joi.number().min(0).default(0),
      currency: Joi.string().uppercase().length(3).default('EUR')
  }),
  publishedDate: Joi.date(),
  link: Joi.string().uri().allow(''),
  tags: Joi.array().items(Joi.string().trim()),
  seniority: Joi.number().integer().default(-1),
  workRhythm: Joi.string().valid('Présentiel', 'Hybride', 'Télétravail total').default('Présentiel'),
  contractType: Joi.string().valid('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance').required(),
})
const createJobSchema = Joi.object({
    title: Joi.string().trim().required(),
    company: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    salary: Joi.object({
        mini: Joi.number().min(0).default(0),
        maxi: Joi.number().min(0).default(0),
        currency: Joi.string().uppercase().length(3).default('EUR')
    }),
    publishedDate: Joi.date(),
    link: Joi.string().uri().allow(''),
    skillsRequired: Joi.array().items(Joi.string().trim()),
    tags: Joi.array().items(Joi.string().trim()),
    educationRequired: Joi.string().trim().allow(''),
    seniority: Joi.number().integer().default(-1),
    workRhythm: Joi.string().valid('Présentiel', 'Hybride', 'Télétravail total').default('Présentiel'),
    contractType: Joi.string().valid('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance').required(),
    applicationSource: Joi.string().trim().allow(''),
    author: contactInSchema,
    contacts: Joi.array().items(contactInSchema)
});
const updateJobSchema = Joi.object({
  title: Joi.string().trim(),
  company: Joi.string().trim(),
  location: Joi.string().trim(),
  salary: Joi.object({
    mini: Joi.number().min(0),
    maxi: Joi.number().min(0),
    currency: Joi.string().uppercase().length(3)
  }),
  publishedDate: Joi.date(),
  link: Joi.string().uri(),
  skillsRequired: Joi.array().items(Joi.string().trim()),
  educationRequired: Joi.string().trim(),
  seniority: Joi.number().integer().default(-1),
  workRhythm: Joi.string().valid('Présentiel', 'Hybride', 'Télétravail total'),
  contractType: Joi.alternatives().try(
    Joi.string().valid('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance'),
    Joi.array().items(Joi.string().valid('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance'))
  ),
  applicationSource: Joi.string().trim(),
  author: Joi.object({
    name: Joi.string().trim(),
    role: Joi.string().trim(),
    contactInfo: Joi.string().trim()
  })
}).min(1);

const updateTagsSchema = Joi.object({
  skillsRequired: Joi.array().items(Joi.string().trim().required()).required()
});

const updateContactsSchema = Joi.object({
  contacts: Joi.array().items(contactInSchema).required()
});

module.exports = { contactInSchema, jobSchema, createJobSchema, updateJobSchema, updateTagsSchema, updateContactsSchema };
