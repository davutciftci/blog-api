"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("../../src/app.js"));
const database_js_1 = __importDefault(require("../../src/config/database.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../setup/integration-setup.js");
let jwtSecret;
describe('Edge Cases & Error Scenarios', () => {
    // Global cleanup is handled in integration-setup.ts
    // Database connection is managed in integration-setup.ts
    beforeAll(async () => {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        jwtSecret = process.env.JWT_SECRET;
    });
    describe('Invalid Input Handling', () => {
        it('should handle missing request body', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({})
                .expect(400);
        });
        it('should handle malformed JSON', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(400);
        });
        it('should handle null values', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: null,
                password: null,
                name: null
            })
                .expect(400);
            expect(response.body).toHaveProperty('error');
        });
        it('should handle empty strings', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: '',
                password: '',
                name: ''
            })
                .expect(400);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('SQL Injection Prevention', () => {
        it('should handle SQL injection attempts in email', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: "'; DROP TABLE users; --",
                password: 'Test1234',
                name: 'Hacker'
            })
                .expect(400);
            expect(response.body.error).toBe('Invalid email format');
        });
        it('should handle special characters in search', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get("/api/posts?search='; DELETE FROM posts; --")
                .expect(200);
            const count = await database_js_1.default.post.count();
            expect(count).toBe(0);
        });
    });
    describe('JWT Token Edge Cases', () => {
        it('should handle expired token', async () => {
            const expiredToken = jsonwebtoken_1.default.sign({ userId: 'test-user', email: 'test@example.com' }, jwtSecret, { expiresIn: '0s' });
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(401);
        });
        it('should handle token with invalid signature', async () => {
            const invalidToken = jsonwebtoken_1.default.sign({ userId: 'test-user' }, 'wrong-secret');
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
        });
        it('should handle malformed token', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer not.a.token')
                .expect(401);
        });
        it('should handle token without Bearer prefix', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', 'some-token')
                .expect(401);
        });
    });
    describe('Database Constraint Violations', () => {
        it('should handle duplicate email registration', async () => {
            const userData = {
                email: 'duplicate-final@example.com',
                password: 'Test1234',
                name: 'User'
            };
            await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(409);
            expect(response.body.error).toContain('already exists');
        });
        it('should handle very long input strings', async () => {
            const longString = 'a'.repeat(10000);
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: 'test@example.com',
                password: 'Test1234',
                name: longString
            });
            expect(response.status).toBe(400);
        });
    });
    describe('Concurrent Request Handling', () => {
        it('should handle concurrent registrations with same email', async () => {
            const userData = {
                email: 'concurrent@example.com',
                password: 'Test1234',
                name: 'User'
            };
            const promises = [
                (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send(userData),
                (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send(userData),
                (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send(userData)
            ];
            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;
            expect(successCount).toBe(1);
            const conflictCount = results.filter(r => r.status === 409).length;
            expect(conflictCount).toBeGreaterThanOrEqual(1);
        });
    });
    describe('404 Handling', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/unknown/route')
                .expect(404);
            expect(response.body.error).toBe('Route not found');
        });
        it('should return 404 for non-existent resource', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            await (0, supertest_1.default)(app_js_1.default)
                .get(`/api/posts/${fakeId}`)
                .expect(404);
        });
    });
    describe('Request Size Limits', () => {
        it('should handle extremely large payloads', async () => {
            const largeContent = 'x'.repeat(1000000); // 1MB
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: 'large-payload-unique@example.com',
                password: 'Test1234',
                name: largeContent
            });
            expect([400, 413]).toContain(response.status);
        });
    });
    describe('Pagination & Filtering Edge Cases', () => {
        it('should handle non-numeric page parameter', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/posts?page=invalid')
                .expect(400);
        });
        it('should handle negative limit parameter', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/posts?limit=-5')
                .expect(400);
        });
    });
    describe('UUID Validation', () => {
        it('should handle malformed UUID in routes', async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .get('/api/posts/not-a-valid-uuid-123')
                .expect(400);
        });
    });
    describe('Security & Input Sanitization', () => {
        it('should store XSS payloads without executing (backend storage check)', async () => {
            const xssContent = '<script>alert("xss")</script>';
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: 'xss-test@example.com',
                password: 'Test1234',
                name: xssContent
            });
            if (response.status === 201) {
                expect(response.body.user.name).toBe(xssContent);
            }
            else if (response.status === 400) {
                expect(response.body.error).toBe('Internal server error');
            }
        });
        it('should reject requests with missing Content-Type for JSON body', async () => {
            // express.json() with missing Content-Type usually results in empty body {}
            // which our application handles as a 400 (missing fields)
            await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .set('Content-Type', 'text/plain')
                .send('{"email":"test@example.com"}')
                .expect(400);
        });
    });
});
