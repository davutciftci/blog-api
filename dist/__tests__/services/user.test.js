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
const mockHash = globals_1.jest.fn();
const mockCompare = globals_1.jest.fn();
// Mock dependencies BEFORE importing services
globals_1.jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: mockHash,
        compare: mockCompare,
    },
    hash: mockHash,
    compare: mockCompare,
}));
globals_1.jest.unstable_mockModule('../../src/config/database.js', () => ({
    default: prisma_mock_js_1.default,
}));
// Use dynamic imports for services to ensure they use mocked modules
const { createUser, getUserById, getUserByEmail, updateUser, deleteUser, } = await Promise.resolve().then(() => __importStar(require('../../src/services/user.js')));
describe('User Service - Simplified', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    describe('getUserById', () => {
        it('should return user when found', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(mockUser);
            const result = await getUserById('1');
            expect(result).toEqual(mockUser);
            expect(prisma_mock_js_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                select: expect.any(Object)
            });
        });
        it('should throw error when user not found', async () => {
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(null);
            await expect(getUserById('999')).rejects.toThrow('User not found');
        });
    });
    describe('getUserByEmail', () => {
        it('should return user with password when found', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashed_password',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(mockUser);
            const result = await getUserByEmail('test@example.com');
            expect(result).toEqual(mockUser);
            expect(result).toHaveProperty('password');
            expect(prisma_mock_js_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
                select: expect.any(Object)
            });
        });
        it('should return null when user not found', async () => {
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(null);
            const result = await getUserByEmail('notfound@example.com');
            expect(result).toBeNull();
        });
    });
    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const userId = 'user-123';
            const updateData = { name: 'Updated Name' };
            const existingUser = {
                id: userId,
                email: 'test@example.com',
                name: 'Old Name',
                password: 'hashedpass',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const updatedUser = {
                ...existingUser,
                name: 'Updated Name',
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(existingUser);
            prisma_mock_js_1.default.user.update.mockResolvedValue(updatedUser);
            const result = await updateUser(userId, updateData);
            expect(result.name).toBe('Updated Name');
            expect(prisma_mock_js_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId }
            });
            expect(prisma_mock_js_1.default.user.update).toHaveBeenCalledTimes(1);
        });
        it('should throw error when user not found', async () => {
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(null);
            await expect(updateUser('999', { name: 'Test' }))
                .rejects.toThrow('User not found');
        });
    });
    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const userId = 'user-123';
            const existingUser = {
                id: userId,
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedpass',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(existingUser);
            prisma_mock_js_1.default.user.delete.mockResolvedValue(existingUser);
            await deleteUser(userId);
            expect(prisma_mock_js_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId }
            });
            expect(prisma_mock_js_1.default.user.delete).toHaveBeenCalledWith({
                where: { id: userId }
            });
        });
        it('should throw error when user not found', async () => {
            prisma_mock_js_1.default.user.findUnique.mockResolvedValue(null);
            await expect(deleteUser('999')).rejects.toThrow('User not found');
        });
    });
});
