import { AttributeValidationRules } from '../rules/AttributeValidationRules';

/**
 * Value Object for Attribute Name
 * Ensures name is always valid and provides domain behavior
 */
export class AttributeName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(name: string): AttributeName {
    const error = AttributeValidationRules.getValidationError(name);
    
    if (error) {
      throw new Error(error);
    }

    const sanitized = AttributeValidationRules.sanitizeName(name);
    return new AttributeName(sanitized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: AttributeName): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase();
  }

  toString(): string {
    return this._value;
  }

  toUpperCase(): string {
    return this._value.toUpperCase();
  }

  toLowerCase(): string {
    return this._value.toLowerCase();
  }
}
