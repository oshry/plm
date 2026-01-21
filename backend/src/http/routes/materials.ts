import { Router, Request, Response } from 'express';
import { MaterialComposition } from '../../application/usecases/materialComposition';

const router = Router();
const materialComposition = new MaterialComposition();

router.get('/', async (req: Request, res: Response) => {
  try {
    const materials = await materialComposition.getAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const material = await materialComposition.getById(id);
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = await materialComposition.create(name);
    const material = await materialComposition.getById(id);
    
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await materialComposition.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

export default router;
