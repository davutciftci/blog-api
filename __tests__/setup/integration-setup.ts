/**
 * Integration Test Setup
 * Handles database connection and cleanup
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Ensure DATABASE_URL is set for integration tests
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please check .env.test file or set it manually. ' +
    'Expected format: postgresql://user:password@localhost:5432/blog_test'
  );
}

console.log('📊 Integration Test Setup: Database URL loaded from .env.test');
console.log(`   Database: ${process.env.DATABASE_URL.split('/').pop()?.split('?')[0]}`);

// Set test timeout using beforeAll since jest is not available at module level
beforeAll(() => {
  jest.setTimeout(60000);
});

// Handle async errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Cleanup after all tests
afterAll(async () => {
  // Cleanup any remaining connections
  await new Promise(resolve => setTimeout(resolve, 500));
});

export {};

