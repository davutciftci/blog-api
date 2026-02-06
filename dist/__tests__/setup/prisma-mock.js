"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = exports.mockPrisma = void 0;
const globals_1 = require("@jest/globals");
console.log('🔍 GLOBAL MOCK: prisma-mock.ts loaded');
// Manuel mock oluştur - jest-mock-extended yerine
// Değişken ismi 'mock' ile başlamalıdır (Jest hoisting kuralı)
exports.mockPrisma = {
    user: {
        create: globals_1.jest.fn(),
        findUnique: globals_1.jest.fn(),
        findFirst: globals_1.jest.fn(),
        findMany: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        updateMany: globals_1.jest.fn(),
        delete: globals_1.jest.fn(),
        deleteMany: globals_1.jest.fn(),
        count: globals_1.jest.fn(),
        aggregate: globals_1.jest.fn(),
        groupBy: globals_1.jest.fn(),
        upsert: globals_1.jest.fn(),
    },
    post: {
        create: globals_1.jest.fn(),
        findUnique: globals_1.jest.fn(),
        findFirst: globals_1.jest.fn(),
        findMany: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        updateMany: globals_1.jest.fn(),
        delete: globals_1.jest.fn(),
        deleteMany: globals_1.jest.fn(),
        count: globals_1.jest.fn(),
        aggregate: globals_1.jest.fn(),
        groupBy: globals_1.jest.fn(),
        upsert: globals_1.jest.fn(),
    },
    comment: {
        create: globals_1.jest.fn(),
        findUnique: globals_1.jest.fn(),
        findFirst: globals_1.jest.fn(),
        findMany: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        updateMany: globals_1.jest.fn(),
        delete: globals_1.jest.fn(),
        deleteMany: globals_1.jest.fn(),
        count: globals_1.jest.fn(),
        aggregate: globals_1.jest.fn(),
        groupBy: globals_1.jest.fn(),
        upsert: globals_1.jest.fn(),
    },
    $connect: globals_1.jest.fn(),
    $disconnect: globals_1.jest.fn(),
    $executeRaw: globals_1.jest.fn(),
    $executeRawUnsafe: globals_1.jest.fn(),
    $queryRaw: globals_1.jest.fn(),
    $queryRawUnsafe: globals_1.jest.fn(),
    $transaction: globals_1.jest.fn(),
};
// Geriye dönük uyumluluk için
exports.prismaMock = exports.mockPrisma;
// Database module'ü global olarak mock etmeyi test dosyaları halletmeli
exports.default = exports.mockPrisma;
