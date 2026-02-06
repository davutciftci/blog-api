"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const prisma_mock_js_1 = __importDefault(require("../setup/prisma-mock.js"));
// Mock dependencies BEFORE importing services/middlewares
globals_1.jest.unstable_mockModule('../../src/config/database.js', () => ({
    __esModule: true,
    default: prisma_mock_js_1.default,
}));
// Use dynamic imports to ensure they use mocked modules
const { authenticate } = await Promise.resolve().then(() => __importStar(require('../../src/middlewares/auth.js')));
const { getUserById } = await Promise.resolve().then(() => __importStar(require('../../src/services/user.js')));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Use the real service but with mocked Prisma
describe('Auth Middleware - Unit Tests', () => {
    const mockRequest = {
        headers: {}
    };
    const mockResponse = {
        status: globals_1.jest.fn().mockReturnThis(),
        json: globals_1.jest.fn()
    };
    const mockNext = globals_1.jest.fn();
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
        mockRequest.headers = {};
    });
    describe('authenticate', () => {
        it('should validate a valid JWT token', async () => {
            const validToken = jsonwebtoken_1.default.sign({ userId: 'user-1', email: 'test@example.com' }, process.env.JWT_SECRET || 'test-secret-key-for-testing', { expiresIn: '7d' });
            mockRequest.headers.authorization = `Bearer ${validToken}`;
            const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User' };
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(mockUser);
            await authenticate(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRequest.user).toBeDefined();
        });
        it('should reject request without authorization header', async () => {
            await authenticate(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should reject malformed authorization header', async () => {
            mockRequest.headers.authorization = 'InvalidFormat';
            await authenticate(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should reject invalid JWT token', async () => {
            mockRequest.headers.authorization = 'Bearer invalid.token.here';
            await authenticate(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
