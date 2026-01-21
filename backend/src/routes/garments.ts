import { Router, Request, Response } from 'express';
import { GarmentService } from '../services/garmentService';
import { AttributeService } from '../services/attributeService';

const router = Router();
const garmentService = new GarmentService();
const attributeService = new AttributeService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const garments = await garmentService.getAll();
    res.json(garments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch garments' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const garment = await garmentService.getById(id);
    
    if (!garment) {
      return res.status(404).json({ error: 'Garment not found' });
    }

    const materials = await garmentService.getMaterials(id);
    const attributes = await garmentService.getAttributes(id);
    const variations = await garmentService.getVariations(id);

    res.json({
      ...garment,
      materials,
      attributes,
      variations,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch garment' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category, lifecycle_state, base_design_id, change_note, attributes } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    if (attributes && attributes.length > 0) {
      const validation = await attributeService.checkIncompatibilities(attributes);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Incompatible attributes',
          conflicts: validation.conflicts,
        });
      }
    }

    const garmentId = await garmentService.create({
      name,
      category,
      lifecycle_state,
      base_design_id,
      change_note,
    });

    if (attributes && attributes.length > 0) {
      for (const attrId of attributes) {
        await garmentService.addAttribute(garmentId, attrId);
      }
    }

    const garment = await garmentService.getById(garmentId);
    res.status(201).json(garment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create garment' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, lifecycle_state, change_note } = req.body;

    const updated = await garmentService.update(id, {
      name,
      category,
      lifecycle_state,
      change_note,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Garment not found or no changes made' });
    }

    const garment = await garmentService.getById(id);
    res.json(garment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update garment' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await garmentService.delete(id);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete garment' });
  }
});

router.post('/:id/materials', async (req: Request, res: Response) => {
  try {
    const garmentId = parseInt(req.params.id);
    const { material_id, percentage } = req.body;

    if (!material_id || !percentage) {
      return res.status(400).json({ error: 'material_id and percentage are required' });
    }

    await garmentService.addMaterial(garmentId, material_id, percentage);
    const materials = await garmentService.getMaterials(garmentId);
    
    res.json(materials);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to add material' });
  }
});

router.get('/:id/materials', async (req: Request, res: Response) => {
  try {
    const garmentId = parseInt(req.params.id);
    const materials = await garmentService.getMaterials(garmentId);
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

router.post('/:id/attributes', async (req: Request, res: Response) => {
  try {
    const garmentId = parseInt(req.params.id);
    const { attribute_id } = req.body;

    if (!attribute_id) {
      return res.status(400).json({ error: 'attribute_id is required' });
    }

    const existingAttributes = await garmentService.getAttributes(garmentId);
    const allAttributeIds = [...existingAttributes.map((a: any) => a.id), attribute_id];

    const validation = await attributeService.checkIncompatibilities(allAttributeIds);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Incompatible attributes',
        conflicts: validation.conflicts,
      });
    }

    await garmentService.addAttribute(garmentId, attribute_id);
    const attributes = await garmentService.getAttributes(garmentId);
    
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add attribute' });
  }
});

router.get('/:id/attributes', async (req: Request, res: Response) => {
  try {
    const garmentId = parseInt(req.params.id);
    const attributes = await garmentService.getAttributes(garmentId);
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attributes' });
  }
});

export default router;
