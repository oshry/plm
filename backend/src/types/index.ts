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

export enum SampleStatus {
  REQUESTED = 'REQUESTED',
  RECEIVED = 'RECEIVED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface Garment {
  id: number;
  name: string;
  category: string;
  lifecycle_state: LifecycleState;
  base_design_id: number | null;
  change_note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Material {
  id: number;
  name: string;
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

export interface GarmentMaterial {
  garment_id: number;
  material_id: number;
  percentage: number;
}

export interface GarmentAttribute {
  garment_id: number;
  attribute_id: number;
}

export interface GarmentSupplier {
  id: number;
  garment_id: number;
  supplier_id: number;
  status: SupplierStatus;
  created_at: Date;
  updated_at: Date;
}

export interface SupplierOffer {
  id: number;
  garment_supplier_id: number;
  price: number;
  currency: string;
  lead_time_days: number;
  created_at: Date;
}

export interface SampleSet {
  id: number;
  garment_supplier_id: number;
  status: SampleStatus;
  received_at: Date | null;
  notes: string | null;
}
