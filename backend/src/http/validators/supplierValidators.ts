import Joi from 'joi';
import { SupplierStatus } from '../../domain/types';

export const supplierSchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Supplier name cannot be empty',
        'string.min': 'Supplier name must be at least 1 character',
        'string.max': 'Supplier name cannot exceed 200 characters',
        'any.required': 'Supplier name is required',
      }),
    contact_email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Contact email must be a valid email address',
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

  garmentIdParam: Joi.object({
    garmentId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Garment ID must be a number',
        'number.integer': 'Garment ID must be an integer',
        'number.positive': 'Garment ID must be positive',
        'any.required': 'Garment ID is required',
      }),
  }),

  addToGarment: Joi.object({
    supplier_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Supplier ID must be a number',
        'number.positive': 'Supplier ID must be positive',
        'any.required': 'Supplier ID is required',
      }),
    status: Joi.string()
      .valid(...Object.values(SupplierStatus))
      .optional()
      .messages({
        'any.only': `Status must be one of: ${Object.values(SupplierStatus).join(', ')}`,
      }),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(...Object.values(SupplierStatus))
      .required()
      .messages({
        'any.only': `Status must be one of: ${Object.values(SupplierStatus).join(', ')}`,
        'any.required': 'Status is required',
      }),
  }),

  addOffer: Joi.object({
    garment_supplier_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Garment supplier ID must be a number',
        'number.positive': 'Garment supplier ID must be positive',
        'any.required': 'Garment supplier ID is required',
      }),
    price: Joi.number()
      .positive()
      .required()
      .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be positive',
        'any.required': 'Price is required',
      }),
    currency: Joi.string()
      .length(3)
      .uppercase()
      .optional()
      .default('USD')
      .messages({
        'string.length': 'Currency must be a 3-letter code',
        'string.uppercase': 'Currency must be uppercase',
      }),
    lead_time_days: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Lead time must be a number',
        'number.integer': 'Lead time must be an integer',
        'number.positive': 'Lead time must be positive',
        'any.required': 'Lead time is required',
      }),
  }),

  addSampleSet: Joi.object({
    garment_supplier_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Garment supplier ID must be a number',
        'number.positive': 'Garment supplier ID must be positive',
        'any.required': 'Garment supplier ID is required',
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 500 characters',
      }),
  }),

  updateSampleStatus: Joi.object({
    status: Joi.string()
      .valid('PENDING', 'RECEIVED', 'PASSED', 'FAILED')
      .required()
      .messages({
        'any.only': 'Status must be one of: PENDING, RECEIVED, PASSED, FAILED',
        'any.required': 'Status is required',
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 500 characters',
      }),
  }),
};
