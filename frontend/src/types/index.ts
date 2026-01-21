export enum LifecycleState {
  CONCEPT = 'CONCEPT',
  DESIGN = 'DESIGN',
  SAMPLE = 'SAMPLE',
  APPROVED = 'APPROVED',
  MASS_PRODUCTION = 'MASS_PRODUCTION',
}

export enum SupplierStatus {
  OFFERED = 'OFFERED',
  SAMPLING = 'SAMPLING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_STORE = 'IN_STORE',
}

export interface Garment {
  id: number;
  name: string;
  category: string;
  lifecycle_state: LifecycleState;
  base_design_id: number | null;
  change_note: string | null;
  created_at: string;
  updated_at: string;
  materials?: Material[];
  attributes?: Attribute[];
  variations?: Garment[];
}

export interface Material {
  id: number;
  name: string;
  percentage?: string;
}

export interface Attribute {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_email: string | null;
}

export interface GarmentSupplier {
  id: number;
  status: SupplierStatus;
  created_at: string;
  updated_at: string;
  supplier_id: number;
  supplier_name: string;
  contact_email: string | null;
}
