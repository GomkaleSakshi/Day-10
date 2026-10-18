import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: Number(process.env.PORT || 5000),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'smart_facility_db',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ANGULAR_URL: process.env.ANGULAR_URL || 'http://localhost:4200',
};

export default config;
