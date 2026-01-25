import { Request, Response } from 'express';
import { MaterialComposition } from "../../application/usecases/materialComposition";

export class MaterialController {
  constructor(
    private materialComposition: MaterialComposition
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const materials = await this.materialComposition.getAll();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const material = await this.materialComposition.getById(id);
      
      if (!material) {
        res.status(404).json({ error: 'Material not found' });
        return;
      }

      res.json(material);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch material' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const id = await this.materialComposition.create(name);
      const material = await this.materialComposition.getById(id);
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create material' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.materialComposition.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Material not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete material' });
      }
    }
  }
}
