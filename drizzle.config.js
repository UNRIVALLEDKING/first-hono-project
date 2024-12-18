import { defineConfig } from 'drizzle-kit';
import { loadEnv } from './src/config/env';
const env = loadEnv();
export default defineConfig({
  out: './src/db/migrations',
  schema: './src/models/*.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
