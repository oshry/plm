export class AttributeValidationRules {
  static readonly MIN_NAME_LENGTH = 1;
  static readonly MAX_NAME_LENGTH = 100;
  static readonly FORBIDDEN_CHARACTERS = ['<', '>', '&', '"', "'"];

  static isValidName(name: string): boolean {
    if (!name || name.trim().length < this.MIN_NAME_LENGTH) {
      return false;
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return false;
    }

    return !this.containsForbiddenCharacters(name);
  }

  static containsForbiddenCharacters(name: string): boolean {
    return this.FORBIDDEN_CHARACTERS.some(char => name.includes(char));
  }

  static sanitizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  static getValidationError(name: string): string | null {
    if (!name || name.trim().length < this.MIN_NAME_LENGTH) {
      return 'Attribute name cannot be empty';
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return `Attribute name cannot exceed ${this.MAX_NAME_LENGTH} characters`;
    }

    if (this.containsForbiddenCharacters(name)) {
      return `Attribute name contains forbidden characters: ${this.FORBIDDEN_CHARACTERS.join(', ')}`;
    }

    return null;
  }
}
