import { Garment, LifecycleState } from '../../domain/types';
import { GarmentRepository } from '../../infra/repositories/GarmentRepository';

export class GarmentAggregate {
  constructor(private garmentRepo: GarmentRepository) {}
  async getAllGarments(): Promise<Garment[]> {
    return await this.garmentRepo.getAll();
  }

  async getGarmentById(id: number): Promise<Garment | null> {
    return await this.garmentRepo.getById(id);
  }

  async createGarment(data: {
    name: string;
    category: string;
    lifecycle_state?: LifecycleState;
    base_design_id?: number;
    change_note?: string;
  }): Promise<number> {
    return await this.garmentRepo.create(data);
  }

  async updateGarment(
    id: number,
    data: {
      name?: string;
      category?: string;
      lifecycle_state?: LifecycleState;
      base_design_id?: number;
      change_note?: string;
    }
  ): Promise<boolean> {
    return await this.garmentRepo.update(id, data);
  }

  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    return await this.garmentRepo.delete(id);
  }

  async addMaterial(
    garmentId: number,
    materialId: number,
    percentage: number
  ): Promise<boolean> {
    return await this.garmentRepo.addMaterial(garmentId, materialId, percentage);
  }

  async getMaterials(garmentId: number): Promise<any[]> {
    return await this.garmentRepo.getMaterials(garmentId);
  }

  async addAttribute(garmentId: number, attributeId: number): Promise<boolean> {
    return await this.garmentRepo.addAttribute(garmentId, attributeId);
  }

  async getAttributes(garmentId: number): Promise<any[]> {
    return await this.garmentRepo.getAttributes(garmentId);
  }

  async getVariations(baseDesignId: number): Promise<Garment[]> {
    return await this.garmentRepo.getVariations(baseDesignId);
  }
}
