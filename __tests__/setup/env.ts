import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

process.env.NODE_ENV = 'test';
