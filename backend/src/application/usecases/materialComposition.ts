import { Material } from '../../domain/types';
import { MaterialRepository } from '../../infra/repositories/MaterialRepository';

export class MaterialComposition {
  constructor(private materialRepo: MaterialRepository) {}

  async getAll(): Promise<Material[]> {
    return await this.materialRepo.findAll();
  }

  async getById(id: number): Promise<Material | null> {
    return await this.materialRepo.findById(id);
  }

  async create(name: string): Promise<number> {
    return await this.materialRepo.create(name);
  }

  async delete(id: number): Promise<boolean> {
    return await this.materialRepo.delete(id);
  }
}
