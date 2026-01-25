# Joi Validation Layer

This folder contains Joi schemas for request validation.

## Architecture

```
HTTP Request
    ↓
Joi Middleware (validates & sanitizes)
    ↓
Controller (clean data)
    ↓
Use Case (business logic)
    ↓
Domain Layer (business rules)
    ↓
Repository (database)
```

## Validation Layers

### 1. **Joi Middleware** (HTTP Layer)
- Validates request format (body, params, query)
- Type checking (string, number, array)
- Required fields
- Min/max lengths
- Custom error messages

**Location**: `http/middleware/validation.ts`

### 2. **Domain Layer** (Business Rules)
- Business-specific validation
- Forbidden characters
- Complex business rules
- Cross-field validation

**Location**: `domain/rules/` and `domain/entities/`

---

## Example: Creating an Attribute

### Request
```bash
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{"name": "  Color  "}'
```

### Validation Flow

**1. Joi Middleware validates:**
- ✅ `name` exists
- ✅ `name` is a string
- ✅ `name` length is 1-100 chars
- ✅ Trims whitespace → `"Color"`

**2. Domain Layer validates:**
- ✅ No forbidden characters (`<`, `>`, `&`, etc.)
- ✅ Sanitizes extra spaces

**3. Repository saves:**
- `"Color"` → database

---

## Validation Schemas

### `attributeValidators.ts`

```typescript
create: Joi.object({
  name: Joi.string()
    .trim()           // Remove whitespace
    .min(1)           // At least 1 char
    .max(100)         // Max 100 chars
    .required()       // Cannot be missing
    .messages({       // Custom error messages
      'string.empty': 'Attribute name cannot be empty',
      'string.max': 'Attribute name cannot exceed 100 characters',
    }),
})
```

---

## Benefits

### ✅ Separation of Concerns
- **Joi**: HTTP validation (format, types, required)
- **Domain**: Business validation (rules, logic)

### ✅ Better Error Messages
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Attribute name cannot be empty"
    }
  ]
}
```

### ✅ Cleaner Controllers
No more manual validation:
```typescript
// Before
if (!name) {
  return res.status(400).json({ error: 'Name is required' });
}

// After (Joi handles it)
const { name } = req.body; // Already validated ✅
```

### ✅ Type Safety
Joi validates and TypeScript types match:
```typescript
validateParams(attributeSchemas.idParam)
// req.params.id is guaranteed to be a positive integer
```

---

## Usage

### In Routes
```typescript
import { validate, validateParams } from '../middleware/validation';
import { attributeSchemas } from '../validators/attributeValidators';

router.post('/', 
  validate(attributeSchemas.create),  // Validates body
  (req, res) => controller.create(req, res)
);

router.get('/:id', 
  validateParams(attributeSchemas.idParam),  // Validates params
  (req, res) => controller.getById(req, res)
);
```

---

## Creating New Validators

1. Create schema in `validators/yourFeatureValidators.ts`
2. Import in routes
3. Add middleware before controller

Example:
```typescript
export const supplierSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    contact_email: Joi.string().email().optional(),
  }),
};
```

---

## Testing Validation

```bash
# Valid request
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{"name": "Color"}'

# Invalid: empty name
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'

# Invalid: too long
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{"name": "'$(printf 'a%.0s' {1..101})'"}'

# Invalid: missing field
curl -X POST http://localhost:3000/api/attributes \
  -H "Content-Type: application/json" \
  -d '{}'
```
