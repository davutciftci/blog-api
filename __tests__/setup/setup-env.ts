import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test
const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

// NODE_ENV explicitly set
process.env.NODE_ENV = 'test';
