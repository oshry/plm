import { Attribute } from '../../domain/types';
import { AttributeRepository } from '../../infra/repositories/AttributeRepository';
import { AttributeName } from '../../domain/entities/AttributeName';

export class AttributePolicy {
  constructor(private attributeRepo: AttributeRepository) {}

  async getAllAttributes(): Promise<Attribute[]> {
    return await this.attributeRepo.findAll();
  }

  async getAttributeById(id: number): Promise<Attribute | null> {
    return await this.attributeRepo.findById(id);
  }

  async createAttribute(name: string): Promise<Attribute> {
    // Domain validation for business rules (forbidden characters, etc.)
    const attributeName = AttributeName.create(name);
    
    const id = await this.attributeRepo.create(attributeName.value);
    const attribute = await this.attributeRepo.findById(id);
    
    if (!attribute) {
      throw new Error('Failed to create attribute');
    }
    return attribute;
  }
  async deleteAttribute(id: number): Promise<void> {
    // Could add:
    // - Check if attribute is in use
    // - Soft delete instead of hard delete
    // - Audit logging
    
    const deleted = await this.attributeRepo.delete(id);
    
    if (!deleted) {
      throw new Error('Attribute not found');
    }
  }

  async addAttributeIncompatibility(
    attributeIdA: number,
    attributeIdB: number
  ): Promise<boolean> {
    return await this.attributeRepo.addAttributeIncompatibility(attributeIdA, attributeIdB);
  }

  async checkAttributeIncompatibilities(attributeIds: number[]): Promise<{
    valid: boolean;
    conflicts?: Array<{ attr1: string; attr2: string }>;
  }> {
    if (attributeIds.length < 2) {
      return { valid: true };
    }

    const conflicts = await this.attributeRepo.findIncompatibilities(attributeIds);

    if (conflicts.length > 0) {
      return {
        valid: false,
        conflicts,
      };
    }


    return { valid: true };
  }
}
