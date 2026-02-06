"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const database_js_1 = __importDefault(require("../../src/config/database.js"));
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const envPath = path_1.default.resolve(__dirname, '../../.env.test');
dotenv_1.default.config({ path: envPath, override: true });
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please check .env.test file or set it manually. ' +
        'Expected format: postgresql://user:password@localhost:5432/blog_test');
}
console.log(`🔍 GLOBAL MOCK: integration-setup.ts loaded`);
console.log(`   Database: ${process.env.DATABASE_URL.split('/').pop()?.split('?')[0]}`);
const cleanDatabase = async () => {
    const models = ['Comment', 'Post', 'User'];
    for (const model of models) {
        try {
            // Try exactly as defined in Prisma (often double-quoted in Postgres)
            await database_js_1.default.$executeRawUnsafe(`TRUNCATE TABLE "${model}" RESTART IDENTITY CASCADE;`);
        }
        catch (error) {
            try {
                // Try lowercase version
                await database_js_1.default.$executeRawUnsafe(`TRUNCATE TABLE "${model.toLowerCase()}" RESTART IDENTITY CASCADE;`);
            }
            catch (innerError) {
                // If TRUNCATE fails, try DELETE as a fallback
                try {
                    await database_js_1.default.$executeRawUnsafe(`DELETE FROM "${model}";`);
                }
                catch (deleteError) {
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
    await database_js_1.default.$disconnect();
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
