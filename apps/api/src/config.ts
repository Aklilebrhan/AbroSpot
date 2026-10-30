import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/abrospot?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'abrospot-super-secure-jwt-secret-key-2026',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  internalSecret: process.env.INTERNAL_API_SECRET || 'abrospot-internal-secret-token',
};
