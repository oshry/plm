import { Request, Response } from 'express';
import { SupplierWorkflow } from "../../application/usecases/supplierWorkflow";

export class SupplierController {
  constructor(
    private supplierWorkflow: SupplierWorkflow
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await this.supplierWorkflow.getAll();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const supplier = await this.supplierWorkflow.getById(id);
      
      if (!supplier) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }

      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supplier' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, contact_email } = req.body;
      const id = await this.supplierWorkflow.create({ name, contact_email });
      const supplier = await this.supplierWorkflow.getById(id);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create supplier' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.supplierWorkflow.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete supplier' });
    }
  }

  async addToGarment(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.garmentId);
      const { supplier_id, status } = req.body;

      const id = await this.supplierWorkflow.addToGarment(garmentId, supplier_id, status);
      res.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add supplier to garment' });
      }
    }
  }

  async getGarmentSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const garmentId = parseInt(req.params.garmentId);
      const suppliers = await this.supplierWorkflow.getGarmentSuppliers(garmentId);
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch garment suppliers' });
    }
  }

  async updateSupplierStatus(req: Request, res: Response): Promise<void> {
    try {
      const garmentSupplierId = parseInt(req.params.id);
      const { status } = req.body;

      await this.supplierWorkflow.updateSupplierStatus(garmentSupplierId, status);
      res.json({ message: 'Status updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update supplier status' });
      }
    }
  }

  async addOffer(req: Request, res: Response): Promise<void> {
    try {
      const { garment_supplier_id, price, currency, lead_time_days } = req.body;

      const id = await this.supplierWorkflow.addOffer({
        garment_supplier_id,
        price,
        currency,
        lead_time_days,
      });

      res.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add offer' });
      }
    }
  }

  async getOffers(req: Request, res: Response): Promise<void> {
    try {
      const garmentSupplierId = parseInt(req.params.id);
      const offers = await this.supplierWorkflow.getOffers(garmentSupplierId);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch offers' });
    }
  }

  async addSampleSet(req: Request, res: Response): Promise<void> {
    try {
      const { garment_supplier_id, notes } = req.body;

      const id = await this.supplierWorkflow.addSampleSet({
        garment_supplier_id,
        notes,
      });

      res.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add sample set' });
      }
    }
  }

  async updateSampleStatus(req: Request, res: Response): Promise<void> {
    try {
      const sampleId = parseInt(req.params.id);
      const { status, notes } = req.body;

      await this.supplierWorkflow.updateSampleStatus(sampleId, status, notes);
      res.json({ message: 'Sample status updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update sample status' });
      }
    }
  }

  async getSamples(req: Request, res: Response): Promise<void> {
    try {
      const garmentSupplierId = parseInt(req.params.id);
      const samples = await this.supplierWorkflow.getSamples(garmentSupplierId);
      res.json(samples);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch samples' });
    }
  }
}
