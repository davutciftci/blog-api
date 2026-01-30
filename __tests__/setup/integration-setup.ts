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
