import { Router, Request, Response } from 'express';
import { SupplierService } from '../services/supplierService';

const router = Router();
const supplierService = new SupplierService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const suppliers = await supplierService.getAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await supplierService.getById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, contact_email } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = await supplierService.create({ name, contact_email });
    const supplier = await supplierService.getById(id);
    
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await supplierService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

router.post('/garment-suppliers', async (req: Request, res: Response) => {
  try {
    const { garment_id, supplier_id, status } = req.body;

    if (!garment_id || !supplier_id) {
      return res.status(400).json({ error: 'garment_id and supplier_id are required' });
    }

    const id = await supplierService.addToGarment(garment_id, supplier_id, status);
    
    res.status(201).json({ id, garment_id, supplier_id, status: status || 'OFFERED' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add supplier to garment' });
  }
});

router.get('/garment-suppliers/:garment_id', async (req: Request, res: Response) => {
  try {
    const garmentId = parseInt(req.params.garment_id);
    const suppliers = await supplierService.getGarmentSuppliers(garmentId);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch garment suppliers' });
  }
});

router.put('/garment-suppliers/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await supplierService.updateSupplierStatus(id, status);

    if (!updated) {
      return res.status(404).json({ error: 'Garment supplier not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.post('/offers', async (req: Request, res: Response) => {
  try {
    const { garment_supplier_id, price, currency, lead_time_days } = req.body;

    if (!garment_supplier_id || !price || !lead_time_days) {
      return res.status(400).json({ 
        error: 'garment_supplier_id, price, and lead_time_days are required' 
      });
    }

    const id = await supplierService.addOffer({
      garment_supplier_id,
      price,
      currency,
      lead_time_days,
    });
    
    res.status(201).json({ id, garment_supplier_id, price, currency, lead_time_days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

router.get('/offers/:garment_supplier_id', async (req: Request, res: Response) => {
  try {
    const garmentSupplierId = parseInt(req.params.garment_supplier_id);
    const offers = await supplierService.getOffers(garmentSupplierId);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

router.post('/samples', async (req: Request, res: Response) => {
  try {
    const { garment_supplier_id, notes } = req.body;

    if (!garment_supplier_id) {
      return res.status(400).json({ error: 'garment_supplier_id is required' });
    }

    const id = await supplierService.addSampleSet({ garment_supplier_id, notes });
    
    res.status(201).json({ id, garment_supplier_id, status: 'REQUESTED', notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sample set' });
  }
});

router.put('/samples/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await supplierService.updateSampleStatus(id, status, notes);

    if (!updated) {
      return res.status(404).json({ error: 'Sample set not found' });
    }

    res.json({ message: 'Sample status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sample status' });
  }
});

router.get('/samples/:garment_supplier_id', async (req: Request, res: Response) => {
  try {
    const garmentSupplierId = parseInt(req.params.garment_supplier_id);
    const samples = await supplierService.getSamples(garmentSupplierId);
    res.json(samples);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch samples' });
  }
});

export default router;
