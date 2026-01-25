import { Router } from 'express';
import { MaterialComposition } from '../../application/usecases/materialComposition';
import { MaterialRepository } from '../../infra/repositories/MaterialRepository';
import { MaterialController } from '../controllers/MaterialsController';
import { validate, validateParams } from '../middleware/validation';
import { materialSchemas } from '../validators/materialValidators';

const router = Router();

const materialRepository = new MaterialRepository();
const materialComposition = new MaterialComposition(materialRepository);
const materialController = new MaterialController(materialComposition);

router.get('/', (req, res) => materialController.getAll(req, res));
router.get('/:id', validateParams(materialSchemas.idParam), (req, res) => materialController.getById(req, res));
router.post('/', validate(materialSchemas.create), (req, res) => materialController.create(req, res));
router.delete('/:id', validateParams(materialSchemas.idParam), (req, res) => materialController.delete(req, res));

export default router;
