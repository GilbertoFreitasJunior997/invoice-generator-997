import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

try{
  config({ path: '.env' });
}
catch{}

export default defineConfig({
  schema: './src/lib/db/tables/*.table.ts',
  out: './src/lib/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
