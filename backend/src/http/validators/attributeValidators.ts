import Joi from 'joi';

export const attributeSchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Attribute name cannot be empty',
        'string.min': 'Attribute name must be at least 1 character',
        'string.max': 'Attribute name cannot exceed 100 characters',
        'any.required': 'Attribute name is required',
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

  addIncompatibility: Joi.object({
    attribute_id_a: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Attribute ID A must be a number',
        'number.positive': 'Attribute ID A must be positive',
        'any.required': 'Attribute ID A is required',
      }),
    attribute_id_b: Joi.number()
      .integer()
      .positive()
      .required()
      .invalid(Joi.ref('attribute_id_a'))
      .messages({
        'number.base': 'Attribute ID B must be a number',
        'number.positive': 'Attribute ID B must be positive',
        'any.required': 'Attribute ID B is required',
        'any.invalid': 'Cannot mark an attribute as incompatible with itself',
      }),
  }),

  validateAttributes: Joi.object({
    attribute_ids: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .required()
      .messages({
        'array.base': 'Attribute IDs must be an array',
        'array.min': 'At least one attribute ID is required',
        'any.required': 'Attribute IDs are required',
      }),
  }),
};
