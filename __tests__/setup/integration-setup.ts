/**
 * Integration Test Setup
 * Handles database connection and cleanup
 */

import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import prisma from '../../src/config/database.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath, override: true });

// Ensure DATABASE_URL is set for integration tests
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please check .env.test file or set it manually. ' +
    'Expected format: postgresql://user:password@localhost:5432/blog_test'
  );
}

console.log('📊 Integration Test Setup: Database URL loaded from .env.test');
console.log(`   Database: ${process.env.DATABASE_URL.split('/').pop()?.split('?')[0]}`);

// Database cleanup function
const cleanDatabase = async () => {
  const tablenames = ['Comment', 'Post', 'User'];
  for (const tablename of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
    } catch (error) {
      console.error(`Error truncating ${tablename}:`, error);
    }
  }
};

// Global hooks for all integration tests
beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Handle async errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export {};

