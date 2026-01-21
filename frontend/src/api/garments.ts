import { apiClient } from './client';
import { Garment, Material, Attribute, GarmentSupplier } from '../types';

export const garmentsApi = {
  getAll: () => apiClient.get<Garment[]>('/api/garments'),
  
  getById: (id: number) => apiClient.get<Garment>(`/api/garments/${id}`),
  
  create: (data: {
    name: string;
    category: string;
    lifecycle_state?: string;
    base_design_id?: number;
    change_note?: string;
    attributes?: number[];
  }) => apiClient.post<Garment>('/api/garments', data),
  
  update: (id: number, data: {
    name?: string;
    category?: string;
    lifecycle_state?: string;
    change_note?: string;
  }) => apiClient.put<Garment>(`/api/garments/${id}`, data),
  
  delete: (id: number) => apiClient.delete(`/api/garments/${id}`),
  
  getMaterials: (id: number) => 
    apiClient.get<Material[]>(`/api/garments/${id}/materials`),
  
  addMaterial: (id: number, materialId: number, percentage: number) =>
    apiClient.post(`/api/garments/${id}/materials`, {
      material_id: materialId,
      percentage,
    }),
  
  getAttributes: (id: number) =>
    apiClient.get<Attribute[]>(`/api/garments/${id}/attributes`),
  
  addAttribute: (id: number, attributeId: number) =>
    apiClient.post(`/api/garments/${id}/attributes`, {
      attribute_id: attributeId,
    }),
};

export const materialsApi = {
  getAll: () => apiClient.get<Material[]>('/api/materials'),
  create: (name: string) => apiClient.post<Material>('/api/materials', { name }),
  delete: (id: number) => apiClient.delete(`/api/materials/${id}`),
};

export const attributesApi = {
  getAll: () => apiClient.get<Attribute[]>('/api/attributes'),
  create: (name: string) => apiClient.post<Attribute>('/api/attributes', { name }),
  delete: (id: number) => apiClient.delete(`/api/attributes/${id}`),
  validate: (attributeIds: number[]) =>
    apiClient.post<{ valid: boolean; conflicts?: Array<{ attr1: string; attr2: string }> }>(
      '/api/attributes/validate',
      { attribute_ids: attributeIds }
    ),
};

export const suppliersApi = {
  getGarmentSuppliers: (garmentId: number) =>
    apiClient.get<GarmentSupplier[]>(`/api/suppliers/garment-suppliers/${garmentId}`),
};
