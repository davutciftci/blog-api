
import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import prisma from '../../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath, override: true });

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please check .env.test file or set it manually. ' +
    'Expected format: postgresql://user:password@localhost:5432/blog_test'
  );
}

console.log(`🔍 GLOBAL MOCK: integration-setup.ts loaded`);
console.log(`   Database: ${process.env.DATABASE_URL.split('/').pop()?.split('?')[0]}`);

const cleanDatabase = async () => {
  const models = ['Comment', 'Post', 'User'];
  
  for (const model of models) {
    try {
      // Try exactly as defined in Prisma (often double-quoted in Postgres)
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${model}" RESTART IDENTITY CASCADE;`);
    } catch (error) {
      try {
        // Try lowercase version
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${model.toLowerCase()}" RESTART IDENTITY CASCADE;`);
      } catch (innerError) {
        // If TRUNCATE fails, try DELETE as a fallback
        try {
          await prisma.$executeRawUnsafe(`DELETE FROM "${model}";`);
        } catch (deleteError) {
          // Only log if all attempts fail
          console.error(`❌ Cleanup failed for ${model}. This may cause Unique Constraint errors in subsequent tests.`);
        }
      }
    }
  }
};


beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export {};

