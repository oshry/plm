-- Seed data for Fashion PLM

USE fashion_plm;

-- Materials
INSERT INTO materials (name) VALUES
('Cotton'),
('Denim'),
('Lycra'),
('Polyester'),
('Wool'),
('Silk'),
('Linen');

-- Attributes
INSERT INTO attributes (name) VALUES
('Long Sleeve'),
('Short Sleeve'),
('Crew Neck'),
('V-Neck'),
('Nightwear'),
('Activewear'),
('Running Outfit'),
('Casual'),
('Formal'),
('Summer'),
('Winter');

-- Attribute Incompatibilities (business rules)
-- Nightwear cannot be running outfit
INSERT INTO attribute_incompatibilities (attribute_id_a, attribute_id_b)
SELECT a1.id, a2.id
FROM attributes a1, attributes a2
WHERE a1.name = 'Nightwear' AND a2.name = 'Running Outfit';

-- Nightwear cannot be activewear
INSERT INTO attribute_incompatibilities (attribute_id_a, attribute_id_b)
SELECT a1.id, a2.id
FROM attributes a1, attributes a2
WHERE a1.name = 'Nightwear' AND a2.name = 'Activewear';

-- Long sleeve and short sleeve are incompatible
INSERT INTO attribute_incompatibilities (attribute_id_a, attribute_id_b)
SELECT a1.id, a2.id
FROM attributes a1, attributes a2
WHERE a1.name = 'Long Sleeve' AND a2.name = 'Short Sleeve';

-- Suppliers
INSERT INTO suppliers (name, contact_email) VALUES
('Premium Textiles Ltd', 'contact@premiumtextiles.com'),
('Global Fashion Supply', 'orders@globalfashion.com'),
('EcoFabric Co', 'info@ecofabric.com'),
('QuickStitch Manufacturing', 'sales@quickstitch.com');

-- Sample Garments
INSERT INTO garments (name, category, lifecycle_state) VALUES
('Classic T-Shirt', 'Tops', 'CONCEPT'),
('Running Shorts', 'Bottoms', 'DESIGN'),
('Winter Coat', 'Outerwear', 'SAMPLE'),
('Yoga Pants', 'Activewear', 'APPROVED'),
('Denim Jeans', 'Bottoms', 'MASS_PRODUCTION');

-- Add materials to garments
-- Classic T-Shirt: 95% Cotton, 5% Lycra
INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 95
FROM garments g, materials m
WHERE g.name = 'Classic T-Shirt' AND m.name = 'Cotton';

INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 5
FROM garments g, materials m
WHERE g.name = 'Classic T-Shirt' AND m.name = 'Lycra';

-- Running Shorts: 80% Polyester, 20% Lycra
INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 80
FROM garments g, materials m
WHERE g.name = 'Running Shorts' AND m.name = 'Polyester';

INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 20
FROM garments g, materials m
WHERE g.name = 'Running Shorts' AND m.name = 'Lycra';

-- Winter Coat: 70% Wool, 30% Polyester
INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 70
FROM garments g, materials m
WHERE g.name = 'Winter Coat' AND m.name = 'Wool';

INSERT INTO garment_materials (garment_id, material_id, percentage)
SELECT g.id, m.id, 30
FROM garments g, materials m
WHERE g.name = 'Winter Coat' AND m.name = 'Polyester';

-- Add attributes to garments
-- Classic T-Shirt: Short Sleeve, Crew Neck, Casual
INSERT INTO garment_attributes (garment_id, attribute_id)
SELECT g.id, a.id
FROM garments g, attributes a
WHERE g.name = 'Classic T-Shirt' AND a.name IN ('Short Sleeve', 'Crew Neck', 'Casual');

-- Running Shorts: Activewear, Running Outfit, Summer
INSERT INTO garment_attributes (garment_id, attribute_id)
SELECT g.id, a.id
FROM garments g, attributes a
WHERE g.name = 'Running Shorts' AND a.name IN ('Activewear', 'Running Outfit', 'Summer');

-- Winter Coat: Long Sleeve, Winter, Formal
INSERT INTO garment_attributes (garment_id, attribute_id)
SELECT g.id, a.id
FROM garments g, attributes a
WHERE g.name = 'Winter Coat' AND a.name IN ('Long Sleeve', 'Winter', 'Formal');

-- Add suppliers to garments
INSERT INTO garment_suppliers (garment_id, supplier_id, status)
SELECT g.id, s.id, 'OFFERED'
FROM garments g, suppliers s
WHERE g.name = 'Classic T-Shirt' AND s.name = 'Premium Textiles Ltd';

INSERT INTO garment_suppliers (garment_id, supplier_id, status)
SELECT g.id, s.id, 'SAMPLING'
FROM garments g, suppliers s
WHERE g.name = 'Running Shorts' AND s.name = 'Global Fashion Supply';

INSERT INTO garment_suppliers (garment_id, supplier_id, status)
SELECT g.id, s.id, 'APPROVED'
FROM garments g, suppliers s
WHERE g.name = 'Winter Coat' AND s.name = 'EcoFabric Co';

INSERT INTO garment_suppliers (garment_id, supplier_id, status)
SELECT g.id, s.id, 'IN_STORE'
FROM garments g, suppliers s
WHERE g.name = 'Denim Jeans' AND s.name = 'QuickStitch Manufacturing';

-- Add supplier offers
INSERT INTO supplier_offers (garment_supplier_id, price, currency, lead_time_days)
SELECT gs.id, 12.50, 'USD', 30
FROM garment_suppliers gs
JOIN garments g ON gs.garment_id = g.id
WHERE g.name = 'Classic T-Shirt';

INSERT INTO supplier_offers (garment_supplier_id, price, currency, lead_time_days)
SELECT gs.id, 18.75, 'USD', 45
FROM garment_suppliers gs
JOIN garments g ON gs.garment_id = g.id
WHERE g.name = 'Running Shorts';

-- Add sample sets
INSERT INTO sample_sets (garment_supplier_id, status, notes)
SELECT gs.id, 'REQUESTED', 'Initial sample request'
FROM garment_suppliers gs
JOIN garments g ON gs.garment_id = g.id
WHERE g.name = 'Running Shorts';

INSERT INTO sample_sets (garment_supplier_id, status, received_at, notes)
SELECT gs.id, 'PASSED', CURRENT_TIMESTAMP, 'Quality approved'
FROM garment_suppliers gs
JOIN garments g ON gs.garment_id = g.id
WHERE g.name = 'Winter Coat';
