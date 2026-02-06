"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("../../src/app.js"));
require("../setup/integration-setup.js");
describe('Auth API Integration Tests', () => {
    // Database connection is managed in integration-setup.ts
    describe('POST /api/auth/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                email: 'register-new-auth@example.com',
                password: 'Test1234',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('register-new-auth@example.com');
            expect(response.body.user.name).toBe('Test User');
            expect(response.body.user).not.toHaveProperty('password');
        });
        it('should return 400 for invalid email', async () => {
            const userData = {
                email: 'invalid-email-auth',
                password: 'Test1234',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body).toHaveProperty('error', 'Invalid email format');
        });
        it('should return 400 for weak password', async () => {
            const userData = {
                email: 'weak-pass-auth-unique@example.com',
                password: 'weak',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.error).toContain('Password must be');
        });
        it('should return 400 for short name', async () => {
            const userData = {
                email: 'short-name-auth-unique@example.com',
                password: 'Test1234',
                name: 'T'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.error).toContain('Name must be');
        });
        it('should return 409 for duplicate email', async () => {
            const userData = {
                email: 'duplicate-auth-unique@example.com',
                password: 'Test1234',
                name: 'Test User'
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
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: 'login-auth-unique@example.com',
                password: 'Test1234',
                name: 'Login User'
            });
        });
        it('should login with correct credentials', async () => {
            const credentials = {
                email: 'login-auth-unique@example.com',
                password: 'Test1234'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/login')
                .send(credentials)
                .expect(200);
            expect(response.body).toHaveProperty('message', 'User logged in successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('login-auth-unique@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });
        it('should return 401 for wrong password', async () => {
            const credentials = {
                email: 'login-auth-unique@example.com',
                password: 'WrongPassword123'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/login')
                .send(credentials)
                .expect(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
        it('should return 401 for non-existent user', async () => {
            const credentials = {
                email: 'notfound-auth-unique@example.com',
                password: 'Test1234'
            };
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/login')
                .send(credentials)
                .expect(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
        it('should return 400 for missing credentials', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/login')
                .send({})
                .expect(400);
            expect(response.body.error).toContain('required');
        });
    });
    describe('GET /api/auth/profile', () => {
        let authToken;
        let userId;
        beforeEach(async () => {
            const registerResponse = await (0, supertest_1.default)(app_js_1.default)
                .post('/api/auth/register')
                .send({
                email: 'profile-new-auth-unique@example.com',
                password: 'Test1234',
                name: 'Profile User'
            });
            expect(registerResponse.status).toBe(201);
            authToken = registerResponse.body.token;
            userId = registerResponse.body.user.id;
        });
        it('should return user profile with valid token', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.id).toBe(userId);
            expect(response.body.user.email).toBe('profile-new-auth-unique@example.com');
        });
        it('should return 401 without token', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .expect(401);
            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
        it('should return 401 with invalid token', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
            expect(response.body).toHaveProperty('error', 'Invalid token');
        });
        it('should return 401 with malformed authorization header', async () => {
            const response = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/auth/profile')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);
            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
    });
});
