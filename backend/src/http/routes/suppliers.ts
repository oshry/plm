import { Router } from 'express';
import { SupplierWorkflow } from '../../application/usecases/supplierWorkflow';
import { SupplierRepository } from '../../infra/repositories/SupplierRepository';
import { SupplierController } from '../controllers/SuppliersController';
import { validate, validateParams } from '../middleware/validation';
import { supplierSchemas } from '../validators/supplierValidators';

const router = Router();

const supplierRepository = new SupplierRepository();
const supplierWorkflow = new SupplierWorkflow(supplierRepository);
const supplierController = new SupplierController(supplierWorkflow);

// Supplier CRUD
router.get('/', (req, res) => supplierController.getAll(req, res));
router.get('/:id', validateParams(supplierSchemas.idParam), (req, res) => supplierController.getById(req, res));
router.post('/', validate(supplierSchemas.create), (req, res) => supplierController.create(req, res));
router.delete('/:id', validateParams(supplierSchemas.idParam), (req, res) => supplierController.delete(req, res));

// Garment-Supplier relationships
router.post('/garment/:garmentId/suppliers', validateParams(supplierSchemas.garmentIdParam), validate(supplierSchemas.addToGarment), (req, res) => supplierController.addToGarment(req, res));
router.get('/garment/:garmentId/suppliers', validateParams(supplierSchemas.garmentIdParam), (req, res) => supplierController.getGarmentSuppliers(req, res));
router.put('/garment-suppliers/:id/status', validateParams(supplierSchemas.idParam), validate(supplierSchemas.updateStatus), (req, res) => supplierController.updateSupplierStatus(req, res));

// Offers
router.post('/offers', validate(supplierSchemas.addOffer), (req, res) => supplierController.addOffer(req, res));
router.get('/offers/:id', validateParams(supplierSchemas.idParam), (req, res) => supplierController.getOffers(req, res));

// Samples
router.post('/samples', validate(supplierSchemas.addSampleSet), (req, res) => supplierController.addSampleSet(req, res));
router.put('/samples/:id', validateParams(supplierSchemas.idParam), validate(supplierSchemas.updateSampleStatus), (req, res) => supplierController.updateSampleStatus(req, res));
router.get('/samples/:id', validateParams(supplierSchemas.idParam), (req, res) => supplierController.getSamples(req, res));

export default router;
