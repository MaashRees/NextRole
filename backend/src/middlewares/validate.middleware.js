const mongoose = require("mongoose");

const validateWithJoi = (schema) => {
    return async (req, res, next) => {
        const {error, value} = schema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.map((detail) => ({
                field : detail.context.key,
                message : detail.message,
            }));
            return res.status(400).json({
                error : true,
                message : "Erreur : Données non valides",
                details: errors
            });
        }
        req.validatedBody = value;
        next();
    };
};
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: true,
      message: "Format d'ID invalide. Un ID MongoDB est requis.",
    });
  }

  next();
};

module.exports = {validateWithJoi, validateId};