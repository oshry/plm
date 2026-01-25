import { Router } from 'express';
import { GarmentAggregate } from '../../application/usecases/garmentAggregate';
import { GarmentRepository } from '../../infra/repositories/GarmentRepository';
import { GarmentController } from '../controllers/GarmentsController';
import { validate, validateParams } from '../middleware/validation';
import { garmentSchemas } from '../validators/garmentValidators';

const router = Router();

const garmentRepository = new GarmentRepository();
const garmentAggregate = new GarmentAggregate(garmentRepository);
const garmentController = new GarmentController(garmentAggregate);

// Garment CRUD
router.get('/', (req, res) => garmentController.getAll(req, res));
router.get('/:id', validateParams(garmentSchemas.idParam), (req, res) => garmentController.getById(req, res));
router.post('/', validate(garmentSchemas.create), (req, res) => garmentController.create(req, res));
router.put('/:id', validateParams(garmentSchemas.idParam), validate(garmentSchemas.update), (req, res) => garmentController.update(req, res));
router.delete('/:id', validateParams(garmentSchemas.idParam), (req, res) => garmentController.delete(req, res));

// Materials
router.post('/:id/materials', validateParams(garmentSchemas.idParam), validate(garmentSchemas.addMaterial), (req, res) => garmentController.addMaterial(req, res));
router.get('/:id/materials', validateParams(garmentSchemas.idParam), (req, res) => garmentController.getMaterials(req, res));

// Attributes
router.post('/:id/attributes', validateParams(garmentSchemas.idParam), validate(garmentSchemas.addAttribute), (req, res) => garmentController.addAttribute(req, res));
router.get('/:id/attributes', validateParams(garmentSchemas.idParam), (req, res) => garmentController.getAttributes(req, res));

export default router;
