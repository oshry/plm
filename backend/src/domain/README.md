# Domain Layer

This layer contains **pure business logic** that is independent of infrastructure, databases, or HTTP.

## Structure

### `/types` - Domain Types
Simple TypeScript interfaces representing data structures.
- `Attribute`, `Supplier`, `Material`, `Garment`
- Enums like `SupplierStatus`, `SampleStatus`

### `/rules` - Business Rules
Pure functions that encode business logic. These are **always true** regardless of where they're called.

**Example**: `AttributeValidationRules.ts`
```typescript
static isValidName(name: string): boolean {
  // This rule is true everywhere in the system
  return name.length > 0 && name.length <= 100;
}
```

### `/entities` - Value Objects & Entities
Objects with behavior and validation. They **cannot exist in an invalid state**.

**Example**: `AttributeName.ts`
```typescript
const name = AttributeName.create("Color"); // ✅ Valid
const name = AttributeName.create("");      // ❌ Throws error
```

## When to Use Domain Layer

### ✅ Use Domain Rules When:
- The logic is a **universal truth** in your business
- It should be **reusable** across use cases
- It's **pure logic** with no side effects
- Example: "Attribute names must be 1-100 characters"

### ❌ Don't Use Domain Layer When:
- Logic depends on external state (database, API)
- It's specific to one use case
- It's just data transformation
- Example: "Check if attribute exists in database"

## Example Flow

```
Controller receives: "  Color  "
         ↓
Use Case calls: AttributeName.create("  Color  ")
         ↓
Domain validates & sanitizes: "Color"
         ↓
Repository saves: "Color"
```

## Benefits

1. **Testable**: Test rules without database or HTTP
2. **Reusable**: Use same validation everywhere
3. **Clear**: Business rules are explicit, not hidden
4. **Safe**: Invalid data cannot be created

## Current Implementation

**Attributes** use domain layer:
- `AttributeValidationRules` - Validation logic
- `AttributeName` - Value object with guaranteed validity

**Other features** (suppliers, materials, garments) can be added as needed.
