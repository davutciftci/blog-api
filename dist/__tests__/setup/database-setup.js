"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.cleanDatabase = cleanDatabase;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const index_js_1 = require("../../src/generated/prisma/index.js");
// Global Prisma instance
exports.prisma = new index_js_1.PrismaClient({
    errorFormat: 'pretty',
});
// Test cleanup function
async function cleanDatabase() {
    try {
        // Delete in correct order (respecting foreign keys)
        await exports.prisma.comment.deleteMany();
        await exports.prisma.post.deleteMany();
        await exports.prisma.user.deleteMany();
    }
    catch (error) {
        console.error('Error cleaning database:', error);
        throw error;
    }
}
// Connect to database
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        console.log('✓ Test database connected');
    }
    catch (error) {
        console.error('✗ Failed to connect to test database:', error);
        throw error;
    }
}
// Disconnect from database
async function disconnectDatabase() {
    try {
        await exports.prisma.$disconnect();
        console.log('✓ Test database disconnected');
    }
    catch (error) {
        console.error('✗ Failed to disconnect from test database:', error);
        throw error;
    }
}
exports.default = exports.prisma;
