"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const index_js_1 = require("../../src/generated/prisma/index.js");
// Create a singleton Prisma client for tests
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new index_js_1.PrismaClient({
        log: ['error'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
