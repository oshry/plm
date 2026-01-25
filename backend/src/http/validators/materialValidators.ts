import Joi from 'joi';

export const materialSchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Material name cannot be empty',
        'string.min': 'Material name must be at least 1 character',
        'string.max': 'Material name cannot exceed 100 characters',
        'any.required': 'Material name is required',
      }),
  }),

  idParam: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required',
      }),
  }),
};
