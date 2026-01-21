# Fashion PLM API Testing Guide

## Base URL
```
http://localhost:3000
```

## Health Check
```bash
curl http://localhost:3000/health
```

## API Overview
```bash
curl http://localhost:3000/api
```

---

## Garments API

### List all garments
```bash
curl http://localhost:3000/api/garments
```

### Get garment by ID (includes materials, attributes, variations)
```bash
curl http://localhost:3000/api/garments/1
```

### Create new garment
```bash
curl -X POST http://localhost:3000/api/garments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Dress",
    "category": "Dresses",
    "lifecycle_state": "CONCEPT",
    "attributes": [2, 10]
  }'
```

### Create garment variation (design evolution)
```bash
curl -X POST http://localhost:3000/api/garments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic T-Shirt V2",
    "category": "Tops",
    "base_design_id": 1,
    "change_note": "Updated neckline to V-neck"
  }'
```

### Update garment
```bash
curl -X PUT http://localhost:3000/api/garments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "lifecycle_state": "DESIGN",
    "change_note": "Moving to design phase"
  }'
```

### Delete garment (fails if MASS_PRODUCTION)
```bash
# This will succeed
curl -X DELETE http://localhost:3000/api/garments/1

# This will fail with error
curl -X DELETE http://localhost:3000/api/garments/5
```

### Add material to garment
```bash
curl -X POST http://localhost:3000/api/garments/1/materials \
  -H "Content-Type: application/json" \
  -d '{
    "material_id": 1,
    "percentage": 95
  }'
```

### Get garment materials
```bash
curl http://localhost:3000/api/garments/1/materials
```

### Add attribute to garment (with incompatibility check)
```bash
curl -X POST http://localhost:3000/api/garments/1/attributes \
  -H "Content-Type: application/json" \
  -d '{
    "attribute_id": 8
  }'
```

### Get garment attributes
```bash
curl http://localhost:3000/api/garments/1/attributes
```

---

## Materials API

### List all materials
```bash
curl http://localhost:3000/api/materials
```

### Get material by ID
```bash
curl http://localhost:3000/api/materials/1
```

### Create material
```bash
curl -X POST http://localhost:3000/api/materials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bamboo Fiber"
  }'
```

### Delete material
```bash
curl -X DELETE http://localhost:3000/api/materials/8
```

---

## Attributes API

### List all attributes
```bash
curl http://localhost:3000/api/attributes
```

### Get attribute by ID
```bash
curl http://localhost:3000/api/attributes/1
```

### Create attribute
```bash
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Waterproof"
  }'
```

### Delete attribute
```bash
curl -X DELETE http://localhost:3000/api/attributes/12
```

### Add incompatibility rule
```bash
curl -X POST http://localhost:3000/api/attributes/incompatibilities \
  -H "Content-Type: application/json" \
  -d '{
    "attribute_id_a": 10,
    "attribute_id_b": 11
  }'
```

### Validate attribute combination
```bash
# Valid combination
curl -X POST http://localhost:3000/api/attributes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "attribute_ids": [1, 3, 8]
  }'

# Invalid combination (Nightwear + Running Outfit)
curl -X POST http://localhost:3000/api/attributes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "attribute_ids": [5, 7]
  }'
```

---

## Suppliers API

### List all suppliers
```bash
curl http://localhost:3000/api/suppliers
```

### Get supplier by ID
```bash
curl http://localhost:3000/api/suppliers/1
```

### Create supplier
```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Textile Co",
    "contact_email": "contact@newtextile.com"
  }'
```

### Delete supplier
```bash
curl -X DELETE http://localhost:3000/api/suppliers/5
```

### Add supplier to garment
```bash
curl -X POST http://localhost:3000/api/suppliers/garment-suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "garment_id": 1,
    "supplier_id": 1,
    "status": "OFFERED"
  }'
```

### Get suppliers for garment
```bash
curl http://localhost:3000/api/suppliers/garment-suppliers/1
```

### Update supplier status
```bash
curl -X PUT http://localhost:3000/api/suppliers/garment-suppliers/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SAMPLING"
  }'
```

### Create supplier offer
```bash
curl -X POST http://localhost:3000/api/suppliers/offers \
  -H "Content-Type: application/json" \
  -d '{
    "garment_supplier_id": 1,
    "price": 15.50,
    "currency": "USD",
    "lead_time_days": 45
  }'
```

### Get offers for garment-supplier
```bash
curl http://localhost:3000/api/suppliers/offers/1
```

### Create sample set
```bash
curl -X POST http://localhost:3000/api/suppliers/samples \
  -H "Content-Type: application/json" \
  -d '{
    "garment_supplier_id": 1,
    "notes": "Initial sample request for quality check"
  }'
```

### Update sample status
```bash
curl -X PUT http://localhost:3000/api/suppliers/samples/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RECEIVED",
    "notes": "Sample received, quality looks good"
  }'
```

### Get samples for garment-supplier
```bash
curl http://localhost:3000/api/suppliers/samples/1
```

---

## Complete Workflow Example

### 1. Create a new garment
```bash
GARMENT_ID=$(curl -s -X POST http://localhost:3000/api/garments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Performance Running Shirt",
    "category": "Activewear",
    "lifecycle_state": "CONCEPT"
  }' | jq -r '.id')

echo "Created garment ID: $GARMENT_ID"
```

### 2. Add materials
```bash
curl -X POST http://localhost:3000/api/garments/$GARMENT_ID/materials \
  -H "Content-Type: application/json" \
  -d '{"material_id": 4, "percentage": 85}'

curl -X POST http://localhost:3000/api/garments/$GARMENT_ID/materials \
  -H "Content-Type: application/json" \
  -d '{"material_id": 3, "percentage": 15}'
```

### 3. Add attributes
```bash
curl -X POST http://localhost:3000/api/garments/$GARMENT_ID/attributes \
  -H "Content-Type: application/json" \
  -d '{"attribute_id": 2}'

curl -X POST http://localhost:3000/api/garments/$GARMENT_ID/attributes \
  -H "Content-Type: application/json" \
  -d '{"attribute_id": 6}'
```

### 4. Add supplier
```bash
GARMENT_SUPPLIER_ID=$(curl -s -X POST http://localhost:3000/api/suppliers/garment-suppliers \
  -H "Content-Type: application/json" \
  -d "{
    \"garment_id\": $GARMENT_ID,
    \"supplier_id\": 1,
    \"status\": \"OFFERED\"
  }" | jq -r '.id')

echo "Created garment-supplier ID: $GARMENT_SUPPLIER_ID"
```

### 5. Add offer
```bash
curl -X POST http://localhost:3000/api/suppliers/offers \
  -H "Content-Type: application/json" \
  -d "{
    \"garment_supplier_id\": $GARMENT_SUPPLIER_ID,
    \"price\": 22.50,
    \"currency\": \"USD\",
    \"lead_time_days\": 60
  }"
```

### 6. Request sample
```bash
SAMPLE_ID=$(curl -s -X POST http://localhost:3000/api/suppliers/samples \
  -H "Content-Type: application/json" \
  -d "{
    \"garment_supplier_id\": $GARMENT_SUPPLIER_ID,
    \"notes\": \"First sample for quality assessment\"
  }" | jq -r '.id')

echo "Created sample ID: $SAMPLE_ID"
```

### 7. Update lifecycle and supplier status
```bash
# Move to design phase
curl -X PUT http://localhost:3000/api/garments/$GARMENT_ID \
  -H "Content-Type: application/json" \
  -d '{"lifecycle_state": "DESIGN"}'

# Update supplier to sampling
curl -X PUT http://localhost:3000/api/suppliers/garment-suppliers/$GARMENT_SUPPLIER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "SAMPLING"}'

# Mark sample as received and passed
curl -X PUT http://localhost:3000/api/suppliers/samples/$SAMPLE_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "PASSED", "notes": "Quality approved, ready for production"}'
```

### 8. View complete garment
```bash
curl http://localhost:3000/api/garments/$GARMENT_ID | jq
```

---

## Business Rules Validation

### Test 1: Incompatible Attributes (Nightwear + Running Outfit)
```bash
curl -X POST http://localhost:3000/api/garments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Garment",
    "category": "Test",
    "attributes": [5, 7]
  }'
# Expected: 400 error with conflict details
```

### Test 2: Delete MASS_PRODUCTION garment
```bash
curl -X DELETE http://localhost:3000/api/garments/5
# Expected: 400 error "Cannot delete garments in mass production"
```

### Test 3: Material percentage validation
```bash
curl -X POST http://localhost:3000/api/garments/1/materials \
  -H "Content-Type: application/json" \
  -d '{"material_id": 1, "percentage": 150}'
# Expected: 400 error about percentage range
```

---

## Seed Data Summary

**Materials:** Cotton, Denim, Lycra, Polyester, Wool, Silk, Linen

**Attributes:** Long Sleeve, Short Sleeve, Crew Neck, V-Neck, Nightwear, Activewear, Running Outfit, Casual, Formal, Summer, Winter

**Incompatibility Rules:**
- Nightwear ↔ Running Outfit
- Nightwear ↔ Activewear
- Long Sleeve ↔ Short Sleeve

**Suppliers:** Premium Textiles Ltd, Global Fashion Supply, EcoFabric Co, QuickStitch Manufacturing

**Sample Garments:**
1. Classic T-Shirt (CONCEPT) - 95% Cotton, 5% Lycra
2. Running Shorts (DESIGN) - 80% Polyester, 20% Lycra
3. Winter Coat (SAMPLE) - 70% Wool, 30% Polyester
4. Yoga Pants (APPROVED)
5. Denim Jeans (MASS_PRODUCTION)
