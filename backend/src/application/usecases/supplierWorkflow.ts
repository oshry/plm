import { Supplier, SupplierStatus } from '../../domain/types';
import { SupplierRepository } from '../../infra/repositories/SupplierRepository';

export class SupplierWorkflow {
  constructor(private supplierRepo: SupplierRepository) {}

  async getAll(): Promise<Supplier[]> {
    return await this.supplierRepo.findAll();
  }

  async getById(id: number): Promise<Supplier | null> {
    return await this.supplierRepo.findById(id);
  }

  async create(data: {
    name: string;
    contact_email?: string;
  }): Promise<number> {
    return await this.supplierRepo.create(data);
  }

  async delete(id: number): Promise<boolean> {
    return await this.supplierRepo.delete(id);
  }

  async addToGarment(
    garmentId: number,
    supplierId: number,
    status: SupplierStatus = SupplierStatus.OFFERED
  ): Promise<number> {
    return await this.supplierRepo.addToGarment(garmentId, supplierId, status);
  }

  async getGarmentSuppliers(garmentId: number): Promise<any[]> {
    return await this.supplierRepo.getGarmentSuppliers(garmentId);
  }

  async updateSupplierStatus(
    garmentSupplierId: number,
    status: SupplierStatus
  ): Promise<boolean> {
    return await this.supplierRepo.updateSupplierStatus(garmentSupplierId, status);
  }

  async addOffer(data: {
    garment_supplier_id: number;
    price: number;
    currency?: string;
    lead_time_days: number;
  }): Promise<number> {
    return await this.supplierRepo.addOffer(data);
  }

  async getOffers(garmentSupplierId: number): Promise<any[]> {
    return await this.supplierRepo.getOffers(garmentSupplierId);
  }

  async addSampleSet(data: {
    garment_supplier_id: number;
    notes?: string;
  }): Promise<number> {
    return await this.supplierRepo.addSampleSet(data);
  }

  async updateSampleStatus(
    sampleId: number,
    status: string,
    notes?: string
  ): Promise<boolean> {
    return await this.supplierRepo.updateSampleStatus(sampleId, status, notes);
  }

  async getSamples(garmentSupplierId: number): Promise<any[]> {
    return await this.supplierRepo.getSamples(garmentSupplierId);
  }
}
