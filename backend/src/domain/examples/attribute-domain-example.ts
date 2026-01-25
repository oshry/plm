/**
 * Example demonstrating how the domain layer works
 * This file is for learning purposes only
 */

import { AttributeName } from '../entities/AttributeName';
import { AttributeValidationRules } from '../rules/AttributeValidationRules';

console.log('=== Domain Layer Examples ===\n');

// Example 1: Using Domain Rules directly
console.log('1. Domain Rules (Pure Functions)');
console.log('   isValidName("Color"):', AttributeValidationRules.isValidName("Color"));
console.log('   isValidName(""):', AttributeValidationRules.isValidName(""));
console.log('   isValidName("a".repeat(101)):', AttributeValidationRules.isValidName("a".repeat(101)));
console.log('   containsForbiddenCharacters("<script>"):', AttributeValidationRules.containsForbiddenCharacters("<script>"));
console.log('   sanitizeName("  Color  "):', AttributeValidationRules.sanitizeName("  Color  "));
console.log();

// Example 2: Using Value Objects
console.log('2. Value Objects (Guaranteed Valid)');
try {
  const name1 = AttributeName.create("Color");
  console.log('   ✅ Created:', name1.value);
  
  const name2 = AttributeName.create("  Size  ");
  console.log('   ✅ Created (sanitized):', name2.value);
  
  console.log('   Equals:', name1.equals(AttributeName.create("color")));
} catch (error) {
  console.log('   ❌ Error:', error);
}
console.log();

// Example 3: Invalid data throws errors
console.log('3. Invalid Data Protection');
try {
  const invalid = AttributeName.create("");
  console.log('   This should not print');
} catch (error) {
  console.log('   ❌ Empty name rejected:', (error as Error).message);
}

try {
  const invalid = AttributeName.create("a".repeat(101));
  console.log('   This should not print');
} catch (error) {
  console.log('   ❌ Too long rejected:', (error as Error).message);
}

try {
  const invalid = AttributeName.create("<script>alert('xss')</script>");
  console.log('   This should not print');
} catch (error) {
  console.log('   ❌ Forbidden chars rejected:', (error as Error).message);
}
console.log();

// Example 4: How it's used in the use case
console.log('4. Use Case Integration');
console.log('   Before: User sends "  Color  "');
console.log('   Domain: AttributeName.create() validates & sanitizes');
console.log('   After: Repository saves "Color"');
console.log('   Benefit: Invalid data CANNOT reach the database');
