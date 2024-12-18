import * as dotenv from 'dotenv';

export function loadEnv() {
  // Load .env file
  dotenv.config();

  // Validate required environment variables
  const requiredEnvs = [
    'PORT',
    'DATABASE_URL',
    // 'REDIS_URL',
    // 'JWT_SECRET',
    // 'CORS_ORIGIN',
  ];

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  });

  return {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    LOG_ENABLED: process.env.LOG_ENABLED || 'true',
    LOG_PRETTY: process.env.LOG_PRETTY || 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  };
}
