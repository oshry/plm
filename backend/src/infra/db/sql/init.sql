-- =====================================================
-- Fashion Product Lifecycle Management
-- Database: fashion_plm
-- Engine: MySQL 8+
-- =====================================================

CREATE DATABASE IF NOT EXISTS fashion_plm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fashion_plm;

-- =====================================================
-- GARMENTS
-- =====================================================

CREATE TABLE garments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,

  lifecycle_state ENUM(
    'CONCEPT',
    'DESIGN',
    'SAMPLE',
    'APPROVED',
    'MASS_PRODUCTION'
  ) NOT NULL DEFAULT 'CONCEPT',

  base_design_id BIGINT NULL,
  change_note VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_garment_base
    FOREIGN KEY (base_design_id) REFERENCES garments(id)
);

CREATE INDEX idx_garments_base_design ON garments(base_design_id);

-- =====================================================
-- MATERIALS
-- =====================================================

CREATE TABLE materials (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- GARMENT MATERIALS (with percentages)
-- =====================================================

CREATE TABLE garment_materials (
  garment_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,

  PRIMARY KEY (garment_id, material_id),

  CONSTRAINT chk_material_percentage
    CHECK (percentage > 0 AND percentage <= 100),

  CONSTRAINT fk_gm_garment
    FOREIGN KEY (garment_id) REFERENCES garments(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_gm_material
    FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- =====================================================
-- ATTRIBUTES
-- =====================================================

CREATE TABLE attributes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- GARMENT ATTRIBUTES
-- =====================================================

CREATE TABLE garment_attributes (
  garment_id BIGINT NOT NULL,
  attribute_id BIGINT NOT NULL,

  PRIMARY KEY (garment_id, attribute_id),

  CONSTRAINT fk_ga_garment
    FOREIGN KEY (garment_id) REFERENCES garments(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_ga_attribute
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);

-- =====================================================
-- ATTRIBUTE INCOMPATIBILITIES (business rules)
-- =====================================================

CREATE TABLE attribute_incompatibilities (
  attribute_id_a BIGINT NOT NULL,
  attribute_id_b BIGINT NOT NULL,

  PRIMARY KEY (attribute_id_a, attribute_id_b),

  CONSTRAINT chk_attribute_order
    CHECK (attribute_id_a < attribute_id_b),

  CONSTRAINT fk_ai_a
    FOREIGN KEY (attribute_id_a) REFERENCES attributes(id),

  CONSTRAINT fk_ai_b
    FOREIGN KEY (attribute_id_b) REFERENCES attributes(id)
);

-- =====================================================
-- SUPPLIERS
-- =====================================================

CREATE TABLE suppliers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_email VARCHAR(255)
);

-- =====================================================
-- GARMENT SUPPLIERS (join + state)
-- =====================================================

CREATE TABLE garment_suppliers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  garment_id BIGINT NOT NULL,
  supplier_id BIGINT NOT NULL,

  status ENUM(
    'OFFERED',
    'SAMPLING',
    'APPROVED',
    'REJECTED',
    'IN_STORE'
  ) NOT NULL DEFAULT 'OFFERED',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE (garment_id, supplier_id),

  CONSTRAINT fk_gs_garment
    FOREIGN KEY (garment_id) REFERENCES garments(id),

  CONSTRAINT fk_gs_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE INDEX idx_gs_garment ON garment_suppliers(garment_id);
CREATE INDEX idx_gs_supplier ON garment_suppliers(supplier_id);

-- =====================================================
-- SUPPLIER OFFERS
-- =====================================================

CREATE TABLE supplier_offers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  garment_supplier_id BIGINT NOT NULL,

  price DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  lead_time_days INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_offer_gs
    FOREIGN KEY (garment_supplier_id)
    REFERENCES garment_suppliers(id)
);

CREATE INDEX idx_offer_gs ON supplier_offers(garment_supplier_id);

-- =====================================================
-- SAMPLE SETS
-- =====================================================

CREATE TABLE sample_sets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  garment_supplier_id BIGINT NOT NULL,

  status ENUM(
    'REQUESTED',
    'RECEIVED',
    'PASSED',
    'FAILED'
  ) NOT NULL DEFAULT 'REQUESTED',

  received_at TIMESTAMP NULL,
  notes VARCHAR(255),

  CONSTRAINT fk_sample_gs
    FOREIGN KEY (garment_supplier_id)
    REFERENCES garment_suppliers(id)
);

CREATE INDEX idx_sample_gs ON sample_sets(garment_supplier_id);

-- =====================================================
-- END OF SCHEMA
-- =====================================================