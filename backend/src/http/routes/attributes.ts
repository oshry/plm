import { Router, Request, Response } from 'express';
import { AttributeService } from '../../application/usecases/attributeService';

const router = Router();
const attributeService = new AttributeService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const attributes = await attributeService.getAll();
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attributes' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const attribute = await attributeService.getById(id);
    
    if (!attribute) {
      return res.status(404).json({ error: 'Attribute not found' });
    }

    res.json(attribute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attribute' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = await attributeService.create(name);
    const attribute = await attributeService.getById(id);
    
    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attribute' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await attributeService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Attribute not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attribute' });
  }
});

router.post('/incompatibilities', async (req: Request, res: Response) => {
  try {
    const { attribute_id_a, attribute_id_b } = req.body;

    if (!attribute_id_a || !attribute_id_b) {
      return res.status(400).json({ error: 'Both attribute IDs are required' });
    }

    if (attribute_id_a === attribute_id_b) {
      return res.status(400).json({ error: 'Cannot mark an attribute as incompatible with itself' });
    }

    await attributeService.addIncompatibility(attribute_id_a, attribute_id_b);
    
    res.status(201).json({ message: 'Incompatibility rule added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add incompatibility' });
  }
});

router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { attribute_ids } = req.body;

    if (!Array.isArray(attribute_ids)) {
      return res.status(400).json({ error: 'attribute_ids must be an array' });
    }

    const result = await attributeService.checkIncompatibilities(attribute_ids);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate attributes' });
  }
});

export default router;
