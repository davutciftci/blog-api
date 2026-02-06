"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../../src/utils/validators");
describe('Auth Validation (Controller Helper Functions)', () => {
    describe('Register Validation', () => {
        it('should validate correct email format for registration', () => {
            const validEmails = [
                'user@example.com',
                'test.user@domain.co.uk',
                'user+tag@example.com'
            ];
            validEmails.forEach(email => {
                expect((0, validators_1.validateEmail)(email)).toBe(true);
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
                expect((0, validators_1.validateEmail)(email)).toBe(false);
            });
        });
        it('should validate password security requirements', () => {
            expect((0, validators_1.validatePassword)('WeakPass')).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
            expect((0, validators_1.validatePassword)('Pass123')).toBe(false);
            expect((0, validators_1.validatePassword)('password123')).toBe(false);
        });
        it('should enforce minimum password length of 8 characters', () => {
            expect((0, validators_1.validatePassword)('Test12')).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        });
        it('should require uppercase letter in password', () => {
            expect((0, validators_1.validatePassword)('test1234')).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        });
        it('should require lowercase letter in password', () => {
            expect((0, validators_1.validatePassword)('TEST1234')).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        });
        it('should require number in password', () => {
            expect((0, validators_1.validatePassword)('TestPassword')).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        });
    });
    describe('Login Validation', () => {
        it('should validate email on login', () => {
            expect((0, validators_1.validateEmail)('user@example.com')).toBe(true);
            expect((0, validators_1.validateEmail)('invalid-email')).toBe(false);
        });
        it('should check password exists for login', () => {
            expect((0, validators_1.validatePassword)(null)).toBe(false);
            expect((0, validators_1.validatePassword)(undefined)).toBe(false);
            expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        });
    });
});
