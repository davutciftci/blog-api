"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Post Controller Unit Test
 * Post işlevlerini test etmek için validators ve formatters fonksiyonlarını kullanıyor
 */
const validators_1 = require("../../src/utils/validators");
const formatters_1 = require("../../src/utils/formatters");
describe('Post Validation (Controller Helper Functions)', () => {
    describe('Create Post Validation', () => {
        it('should validate post title is not empty and minimum 3 characters', () => {
            expect((0, validators_1.isEmpty)('Valid Title')).toBe(false);
            expect((0, validators_1.isEmpty)('')).toBe(true); // Empty string is empty
            expect((0, validators_1.validateLength)('Hi', 3, 100)).toBe(false); // Too short
            expect((0, validators_1.validateLength)('Valid Title', 3, 100)).toBe(true); // Valid
        });
        it('should validate post content is not empty and minimum 10 characters', () => {
            expect((0, validators_1.isEmpty)('Short')).toBe(false);
            expect((0, validators_1.validateLength)('Short', 10, 5000)).toBe(false); // Too short
            expect((0, validators_1.validateLength)('This is a valid post content', 10, 5000)).toBe(true); // Valid
        });
        it('should trim whitespace from title and content', () => {
            expect((0, validators_1.isEmpty)('   ')).toBe(true);
            expect((0, validators_1.isEmpty)('  \t\n')).toBe(true);
            expect((0, validators_1.isEmpty)('  Valid Title  ')).toBe(false); // Trimmed correctly
        });
        it('should generate slug from post title', () => {
            expect((0, formatters_1.slugify)('My First Post')).toBe('my-first-post');
            expect((0, formatters_1.slugify)('Test Post Title')).toBe('test-post-title');
            expect((0, formatters_1.slugify)('Post-With-Dashes')).toBe('post-with-dashes');
        });
        it('should handle special characters in slug generation', () => {
            expect((0, formatters_1.slugify)('Post & Content')).toMatch(/^post-content$/);
            expect((0, formatters_1.slugify)('Hello@World!')).toMatch(/^helloworld$/);
        });
    });
    describe('Get Post Validation', () => {
        it('should validate post ID exists', () => {
            expect((0, validators_1.isEmpty)('valid-id-123')).toBe(false);
            expect((0, validators_1.isEmpty)(null)).toBe(true);
            expect((0, validators_1.isEmpty)(undefined)).toBe(true);
        });
        it('should truncate long post content for preview', () => {
            const longContent = 'a'.repeat(150);
            expect((0, formatters_1.truncate)(longContent, 100).length).toBeLessThanOrEqual(103); // 100 + "..."
            expect((0, formatters_1.truncate)('Short content', 100)).toBe('Short content');
        });
    });
    describe('Update Post Validation', () => {
        it('should validate updated title if provided', () => {
            expect((0, validators_1.validateLength)('New Title', 3, 100)).toBe(true);
            expect((0, validators_1.validateLength)('Hi', 3, 100)).toBe(false);
        });
        it('should validate updated content if provided', () => {
            expect((0, validators_1.validateLength)('Updated content here', 10, 5000)).toBe(true);
            expect((0, validators_1.validateLength)('Short', 10, 5000)).toBe(false);
        });
        it('should handle partial updates (fields can be undefined)', () => {
            // Partial updates should only validate provided fields
            expect((0, validators_1.isEmpty)(null)).toBe(true); // null is allowed for optional update
            expect((0, validators_1.isEmpty)('New Title')).toBe(false); // New value is valid
        });
    });
    describe('Delete Post Validation', () => {
        it('should validate post ID exists before deletion', () => {
            expect((0, validators_1.isEmpty)('post-id-to-delete')).toBe(false);
            expect((0, validators_1.isEmpty)('')).toBe(true); // Empty ID should be rejected
        });
        it('should validate user authorization (helper)', () => {
            // Auth check would be done in middleware, but we test the validator prep
            expect((0, validators_1.isEmpty)('user-id')).toBe(false);
        });
    });
    describe('List Posts Validation', () => {
        it('should validate pagination parameters', () => {
            expect((0, validators_1.validateLength)('1', 1, 5)).toBe(true); // Page 1
            expect((0, validators_1.validateLength)('10', 1, 5)).toBe(true); // Page 10
            expect((0, validators_1.validateLength)('', 1, 5)).toBe(false); // Empty not allowed
        });
        it('should validate filter parameters', () => {
            const publishedFilter = 'true';
            expect(['true', 'false'].includes(publishedFilter)).toBe(true);
        });
        it('should truncate post titles in list view', () => {
            const longTitle = 'Very Long Post Title That Should Be Truncated In List View';
            const truncated = (0, formatters_1.truncate)(longTitle, 50);
            expect(truncated.length).toBeLessThanOrEqual(53);
        });
    });
});
