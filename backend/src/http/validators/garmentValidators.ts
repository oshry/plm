import Joi from 'joi';
import { LifecycleState } from '../../domain/types';

export const garmentSchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Garment name cannot be empty',
        'string.min': 'Garment name must be at least 1 character',
        'string.max': 'Garment name cannot exceed 200 characters',
        'any.required': 'Garment name is required',
      }),
    category: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required',
      }),
    lifecycle_state: Joi.string()
      .valid(...Object.values(LifecycleState))
      .optional()
      .messages({
        'any.only': `Lifecycle state must be one of: ${Object.values(LifecycleState).join(', ')}`,
      }),
    base_design_id: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Base design ID must be a number',
        'number.positive': 'Base design ID must be positive',
      }),
    change_note: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Change note cannot exceed 500 characters',
      }),
  }),

  update: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .optional()
      .messages({
        'string.empty': 'Garment name cannot be empty',
        'string.max': 'Garment name cannot exceed 200 characters',
      }),
    category: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.empty': 'Category cannot be empty',
      }),
    lifecycle_state: Joi.string()
      .valid(...Object.values(LifecycleState))
      .optional()
      .messages({
        'any.only': `Lifecycle state must be one of: ${Object.values(LifecycleState).join(', ')}`,
      }),
    base_design_id: Joi.number()
      .integer()
      .positive()
      .optional()
      .allow(null)
      .messages({
        'number.base': 'Base design ID must be a number',
        'number.positive': 'Base design ID must be positive',
      }),
    change_note: Joi.string()
      .max(500)
      .optional()
      .allow(null)
      .messages({
        'string.max': 'Change note cannot exceed 500 characters',
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

  addMaterial: Joi.object({
    material_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Material ID must be a number',
        'number.positive': 'Material ID must be positive',
        'any.required': 'Material ID is required',
      }),
    percentage: Joi.number()
      .min(0.01)
      .max(100)
      .required()
      .messages({
        'number.base': 'Percentage must be a number',
        'number.min': 'Percentage must be greater than 0',
        'number.max': 'Percentage cannot exceed 100',
        'any.required': 'Percentage is required',
      }),
  }),

  addAttribute: Joi.object({
    attribute_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Attribute ID must be a number',
        'number.positive': 'Attribute ID must be positive',
        'any.required': 'Attribute ID is required',
      }),
  }),
};
