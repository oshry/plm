import { Router } from 'express';
import { AttributePolicy } from '../../application/usecases/attributePolicy';
import { AttributeRepository } from '../../infra/repositories/AttributeRepository';
import { AttributeController } from '../controllers/AttributesController';
import { validate, validateParams } from '../middleware/validation';
import { attributeSchemas } from '../validators/attributeValidators';

const router = Router();

const attributeRepository = new AttributeRepository();
const attributePolicy = new AttributePolicy(attributeRepository);
const attributeController = new AttributeController(attributePolicy);

router.get('/', (req, res) => attributeController.getAll(req, res));
router.get('/:id', validateParams(attributeSchemas.idParam), (req, res) => attributeController.getById(req, res));
router.post('/', validate(attributeSchemas.create), (req, res) => attributeController.create(req, res));
router.delete('/:id', validateParams(attributeSchemas.idParam), (req, res) => attributeController.delete(req, res));
router.post('/incompatibilities', validate(attributeSchemas.addIncompatibility), (req, res) => attributeController.addIncompatibility(req, res));
router.post('/validate', validate(attributeSchemas.validateAttributes), (req, res) => attributeController.validateAttributes(req, res));

export default router;
