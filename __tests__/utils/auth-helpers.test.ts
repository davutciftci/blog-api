/**
 * Auth Controller Unit Test
 * Auth işlevlerini test etmek için validators ve utility fonksiyonlarını kullanıyor
 */
import { validateEmail, validatePassword } from '../../src/utils/validators';
import { slugify } from '../../src/utils/formatters';

describe('Auth Validation (Controller Helper Functions)', () => {
  describe('Register Validation', () => {
    it('should validate correct email format for registration', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'user+tag@example.com'
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats during registration', () => {
      const invalidEmails = [
        'invalid',
        'user@',
        '@example.com',
        'user @example.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should validate password security requirements', () => {
      expect(validatePassword('WeakPass')).toBe(false); // No numbers
      expect(validatePassword('Test1234')).toBe(true);  // Valid
      expect(validatePassword('Pass123')).toBe(false);  // Too short
      expect(validatePassword('password123')).toBe(false); // No uppercase
    });

    it('should enforce minimum password length of 8 characters', () => {
      expect(validatePassword('Test12')).toBe(false);
      expect(validatePassword('Test1234')).toBe(true);
    });

    it('should require uppercase letter in password', () => {
      expect(validatePassword('test1234')).toBe(false);
      expect(validatePassword('Test1234')).toBe(true);
    });

    it('should require lowercase letter in password', () => {
      expect(validatePassword('TEST1234')).toBe(false);
      expect(validatePassword('Test1234')).toBe(true);
    });

    it('should require number in password', () => {
      expect(validatePassword('TestPassword')).toBe(false);
      expect(validatePassword('Test1234')).toBe(true);
    });
  });

  describe('Login Validation', () => {
    it('should validate email on login', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should check password exists for login', () => {
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
      expect(validatePassword('Test1234')).toBe(true);
    });
  });
});
