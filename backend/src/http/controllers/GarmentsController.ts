import { Request, Response } from 'express';
import { GarmentAggregate } from "../../application/usecases/garmentAggregate";

export class GarmentController {
  constructor(
    private garmentAggregate: GarmentAggregate
  ) {}
  
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const garments = await this.garmentAggregate.getAllGarments();
      res.json(garments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch garments' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const garment = await this.garmentAggregate.getGarmentById(id);
      
      if (!garment) {
        res.status(404).json({ error: 'Garment not found' });
        return;
      }

      const materials = await this.garmentAggregate.getMaterials(id);
      const attributes = await this.garmentAggregate.getAttributes(id);
      const variations = await this.garmentAggregate.getVariations(id);

      res.json({
        ...garment,
        materials,
        attributes,
        variations,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch garment' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, lifecycle_state, base_design_id, change_note } = req.body;
      
      const garmentId = await this.garmentAggregate.createGarment({
        name,
        category,
        lifecycle_state,
        base_design_id,
        change_note,
      });

      const garment = await this.garmentAggregate.getGarmentById(garmentId);
      res.status(201).json(garment);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create garment' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name, category, lifecycle_state, base_design_id, change_note } = req.body;
      
      const updated = await this.garmentAggregate.updateGarment(id, {
        name,
        category,
        lifecycle_state,
        base_design_id,
        change_note,
      });

      if (!updated) {
        res.status(404).json({ error: 'Garment not found or no changes made' });
        return;
      }

      const garment = await this.garmentAggregate.getGarmentById(id);
      res.json(garment);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update garment' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await this.garmentAggregate.delete(id);

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete garment' });
    }
  }

  async addMaterial(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.id);
      const { material_id, percentage } = req.body;

      await this.garmentAggregate.addMaterial(garmentId, material_id, percentage);
      const materials = await this.garmentAggregate.getMaterials(garmentId);
      
      res.json(materials);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add material' });
      }
    }
  }

  async getMaterials(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.id);
      const materials = await this.garmentAggregate.getMaterials(garmentId);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  }

  async addAttribute(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.id);
      const { attribute_id } = req.body;

      await this.garmentAggregate.addAttribute(garmentId, attribute_id);
      const attributes = await this.garmentAggregate.getAttributes(garmentId);
      
      res.json(attributes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add attribute' });
      }
    }
  }

  async getAttributes(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.id);
      const attributes = await this.garmentAggregate.getAttributes(garmentId);
      res.json(attributes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attributes' });
    }
  }
}
