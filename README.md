# Invoice Generator 997

## How to run the project

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Create a WorkOS project and set `WORKOS_API_KEY` and `WORKOS_CLIENT_ID`

3. Create a secure 32 chars cookie password and set it to `WORKOS_COOKIE_PASSWORD`:
   ```bash
    openssl rand -base64 32
    # or
    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. Create a database in Turso and set `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`

5. Install dependencies:
   ```bash
   pnpm install
   ```

6. Migrate database
   ```bash
   pnpm drizzle-kit migrate
   ```

7. Run the project:
   ```bash
   pnpm dev
   ```