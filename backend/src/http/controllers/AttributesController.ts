import { Request, Response } from "express";
import { AttributePolicy } from "../../application/usecases/attributePolicy";

export class AttributeController {
  constructor(
    private attributePolicy: AttributePolicy
  ) {
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const attributes = await this.attributePolicy.getAllAttributes();
      res.json(attributes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attributes' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const attribute = await this.attributePolicy.getAttributeById(id);
      
      if (!attribute) {
        res.status(404).json({ error: 'Attribute not found' });
        return;
      }

      res.json(attribute);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attribute' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const attribute = await this.attributePolicy.createAttribute(name);
      res.status(201).json(attribute);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create attribute' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.attributePolicy.deleteAttribute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Attribute not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete attribute' });
      }
    }
  }

  async addIncompatibility(req: Request, res: Response): Promise<void> {
    try {
      const { attribute_id_a, attribute_id_b } = req.body;
      await this.attributePolicy.addAttributeIncompatibility(attribute_id_a, attribute_id_b);
      res.status(201).json({ message: 'Incompatibility rule added' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add incompatibility' });
    }
  }

  async validateAttributes(req: Request, res: Response): Promise<void> {
    try {
      const { attribute_ids } = req.body;
      const result = await this.attributePolicy.checkAttributeIncompatibilities(attribute_ids);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to validate attributes' });
    }
  }
}
