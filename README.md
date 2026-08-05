# Job Board

A full-stack job board built with Next.js, TypeScript, Prisma, PostgreSQL, NextAuth.js, and Tailwind CSS.

Users can create accounts, browse and search jobs, post and edit job listings, apply to jobs, and manage application statuses from a dashboard.

## Features

- Email/password authentication with secure password hashing.
- Optional GitHub OAuth 2.0 alternate sign-in.
- Protected dashboard, job-posting, and job-editing routes.
- Job search by keyword, type, and location with pagination.
- Job creation, editing, and deletion.
- One application per user per job.
- Employers can accept or reject applicants.
- Zod validation on client and server flows.
- Prisma migrations for PostgreSQL.
- Health endpoint at `/api/health`.
- Auth diagnostics at `/api/auth/status`.
- Responsive UI with loading, error, and recovery states.
- End-to-end integration tests for auth, jobs, applications, and protected routes.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- PostgreSQL
- Prisma ORM
- NextAuth.js v4 with Prisma Adapter
- Zod
- Tailwind CSS v4
- date-fns

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Neon, Supabase, or Railway

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file:

```powershell
Copy-Item .env.example .env
```

Set the required values:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/jobportal?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-random-secret-at-least-32-characters-long"
```

Hosted PostgreSQL connection strings commonly require:

```text
?sslmode=require
```

Generate a secret with:

```bash
openssl rand -base64 32
```

### 3. Optional: enable GitHub OAuth 2.0

Set both variables to show the alternate GitHub sign-in button:

```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Create a GitHub OAuth App with this local callback URL:

```text
http://localhost:3000/api/auth/callback/github
```

For production:

```text
https://your-domain.com/api/auth/callback/github
```

Check the provider configuration at:

```text
http://localhost:3000/api/auth/status
```

The response should include `"github": true` when OAuth is configured correctly.

### 4. Apply database migrations

```bash
npx prisma migrate deploy
```

For local schema development:

```bash
npx prisma migrate dev --name describe-your-change
```

Regenerate Prisma Client when needed:

```bash
npx prisma generate
```

### 5. Optional: seed demo data

```bash
npm run db:seed
```

The seed creates:

| Role | Email | Password |
|---|---|---|
| Employer | `employer@demo.com` | `demoPass1` |
| Seeker | `seeker@demo.com` | `demoPass1` |

It also creates a demo job and application.

## Running the app

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production locally

```bash
npm run build
npm start
```

For a production build that also deploys migrations:

```bash
npm run build:prod
npm start
```

Do not run two servers on port 3000 at the same time.

## Testing and validation

Validate environment variables:

```bash
npm run validate:env
```

Run linting:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run the production build:

```bash
npm run build
```

Run the full integration suite:

```text
Terminal 1: npm start
Terminal 2: npm test
```

The integration suite verifies public pages, protected redirects, signup, duplicate signup handling, credentials login, dashboard access, job creation/listing/detail, validation, applications, duplicate applications, unauthenticated access, and 404 behavior.

The suite requires a running server on port 3000 and a reachable PostgreSQL database. Use another server URL with:

```powershell
$env:TEST_BASE_URL="http://localhost:3001"
npm test
```

## Health checks

Database health:

```text
GET /api/health
```

Healthy response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Auth/provider status:

```text
GET /api/auth/status
```

## Application structure

```text
src/
â”œâ”€â”€ app/                    Next.js pages, routes, and API handlers
â”œâ”€â”€ config/                 Auth, database, environment, and session setup
â”œâ”€â”€ controllers/            Business rules and validation orchestration
â”œâ”€â”€ models/                 Prisma data-access functions
â”œâ”€â”€ providers/              React providers
â”œâ”€â”€ types/                  Shared TypeScript types
â”œâ”€â”€ utils/                  API responses, crypto, rate limiting, and schemas
â””â”€â”€ views/                  UI components

prisma/
â”œâ”€â”€ migrations/             Versioned database migrations
â”œâ”€â”€ schema.prisma           Database schema
â””â”€â”€ seed.mjs                Demo data seeder
```

Typical request flow:

```text
Browser â†’ app route/API route â†’ controller â†’ model â†’ PostgreSQL
                         â†“
                       view
```

## Authentication notes

- Credentials sessions use JWT strategy with a 30-day maximum age.
- Passwords are stored as salted scrypt hashes.
- GitHub OAuth 2.0 is enabled only when both GitHub variables are present.
- Cookie security follows the protocol in `NEXTAUTH_URL`.
- Protected routes preserve the original destination after sign-in.
- Production OAuth account-linking protections remain enabled.

## Troubleshooting

### `npm test` says `Server reachable â€” fetch failed`

Start the app first:

```bash
npm start
```

Then run in a second terminal:

```bash
npm test
```

### `EADDRINUSE: port 3000 already in use`

Reuse the existing server, or stop it before starting another:

```powershell
$connection = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($connection) {
  Stop-Process -Id $connection.OwningProcess -Force
}
```

### Prisma `EPERM` while renaming the Windows query engine

A running Next.js process is locking Prisma's generated engine. Stop the app server, then run:

```bash
npm run build
```

Start the server only after the build completes.

### `/api/health` returns `503`

Check that `DATABASE_URL` is correct, the provider is online, cloud URLs include SSL settings, and migrations are applied:

```bash
npx prisma migrate deploy
```

### Protected routes repeatedly ask for sign-in

Make sure `NEXTAUTH_URL` exactly matches the browser URL, including protocol and port:

```env
NEXTAUTH_URL="http://localhost:3000"
```

Restart the server after changing environment variables and clear old `next-auth` cookies or use a private browser window.

## Deployment checklist

- Set `DATABASE_URL` for the production PostgreSQL database.
- Set a unique `NEXTAUTH_SECRET` with at least 32 characters.
- Set `NEXTAUTH_URL` to the exact HTTPS deployment URL.
- Add GitHub OAuth credentials if OAuth2 sign-in is required.
- Update the GitHub OAuth callback URL for production.
- Run Prisma migrations.
- Confirm `/api/health` reports `database: connected`.
- Confirm `/api/auth/status` reports the expected providers.
- Run `npm run build` before deployment.
- Never commit `.env`, OAuth secrets, database credentials, or generated secrets.

## License

This project is private unless a license is added by the project owner.

