# 💼 Job Board Application

Welcome to the **Job Board Application**! This is a modern, full-stack web application designed to connect job seekers with employers. Users can browse listed jobs, view job details, apply with a single click, post new jobs, and track application statuses through a personalized dashboard.

This project is built using **Next.js (App Router)**, **Prisma**, **PostgreSQL**, **NextAuth.js**, and **Tailwind CSS**. It is designed with beginner-friendly structures and patterns, making it a great codebase to learn or expand upon.

---

## 🚀 Key Features

*   🔒 **Secure Authentication**: Sign up and sign in with **email and password**. GitHub OAuth is optional when configured.
*   💼 **Job Browsing**: A clean interface for searching and browsing through job listings.
*   📝 **Job Posting**: Logged-in users can post new job openings with fields like title, company, location, type (Full-time/Part-time/etc.), salary, and description.
*   ✉️ **One-Click Application**: Job seekers can apply to listings in a single click, preventing duplicate applications.
*   📊 **Personalized Dashboard**: Track both:
    *   **Jobs you have posted** (along with the list of candidates who applied and their status).
    *   **Jobs you have applied for** (and check if they are `Pending`, `Accepted`, or `Rejected`).
*   🎨 **Modern UI**: Fully responsive interface styled with Tailwind CSS.

---

## 🛠️ Tech Stack & Technologies

*   **Framework**: [Next.js (v16 App Router)](https://nextjs.org/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: PostgreSQL
*   **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/) with Prisma Adapter
*   **Form & Data Validation**: [Zod](https://zod.dev/)
*   **Styling**: [Tailwind CSS (v4)](https://tailwindcss.com/)
*   **Language**: TypeScript

---

## 🏃 Getting Started

Follow these step-by-step instructions to get a local copy of this project running on your computer.

### Step 1: Clone the Project & Install Dependencies

Open your terminal and run:

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project folder
cd job-posting-website

# Install all package dependencies
npm install
```

### Step 2: Configure Environment Variables

Create two files in your root directory: `.env` and `.env.local` (or put them all in `.env`). Fill in the details below.

#### `.env` File
```env
PORT=3000

# Option A: Cloud PostgreSQL Database (recommended for Vercel/Production)
# Services: Neon, Supabase, Railway, etc.
# sslmode=require is necessary for cloud PostgreSQL connection strings in serverless environments.
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/jobportal?sslmode=require"

# Option B: Local PostgreSQL Database (development only)
# DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

# Credentials for GitHub OAuth (optional — sign-in button appears automatically when both are set)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

#### `.env.local` File
```env
# NextAuth settings (required for sign-in to work)
NEXTAUTH_URL="http://localhost:3000"

# A secure random string used to hash tokens. 
# You can generate a good one in terminal using: openssl rand -base64 32
NEXTAUTH_SECRET="your_nextauth_secret_key"
```

> [!TIP]
> Copy `.env.example` to `.env.local` and fill in your values to get started quickly.

> [!NOTE]
> **Email & password auth (works out of the box)**
> 1. Start the app and go to `/auth/signup` to create an account.
> 2. Sign in at `/auth/signin` with your email and password.
> 3. No GitHub OAuth setup is required for this flow.

> [!NOTE]
> **How to enable GitHub OAuth (optional)**
> 1. Go to GitHub → **Settings** → **Developer Settings** → **OAuth Apps** → **New OAuth App**.
> 2. Set **Application Name** to `Job Board`.
> 3. Set **Homepage URL** to your app URL (e.g. `http://localhost:3000` or `https://your-app.vercel.app`).
> 4. Set **Authorization callback URL** to `{YOUR_URL}/api/auth/callback/github`
>    - Local: `http://localhost:3000/api/auth/callback/github`
>    - Production: `https://your-app.vercel.app/api/auth/callback/github`
> 5. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env.local` (local) or Vercel env vars (production).
> 6. The **Sign in with GitHub** button appears automatically when both GitHub env vars are set.
>
> **Important:** GitHub allows only one callback URL per OAuth App. Create separate OAuth Apps for local dev and production, or use one app and update the callback URL when switching environments.
>
> **Verify setup:** Visit `/api/auth/status` — you should see `"github": true` and the correct `callbackUrl`.

---

### Step 3: Run Database Migrations

This project uses Prisma to interact with PostgreSQL. You need to create the database tables.

Run the following command to push your database schema definition to your PostgreSQL instance:

```bash
npx prisma db push
```

*Note: This command reads `prisma/schema.prisma` and creates the matching tables in your local database without creating formal migration files, which is excellent for rapid prototyping.*

---

### Step 4: Run the Development Server

Now you're ready to start the server!

```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to see the application in action!

### Optional: Seed demo data

```bash
npm run db:seed
```

Demo accounts:
- **Employer:** `employer@demo.com` / `demoPass1`
- **Seeker:** `seeker@demo.com` / `demoPass1`

### Run tests

```bash
npm run dev   # terminal 1
npm test      # terminal 2
```

---

## ☁️ Solution: Deploying with Cloud PostgreSQL (Neon/Supabase) & Vercel

If you want to host your database on a cloud provider like **Neon**, **Supabase**, **Railway**, or **Aiven** and host the app on **Vercel**, follow these steps:

### Step 1: Secure a Cloud PostgreSQL Database URL
1. Sign up on [Neon](https://neon.tech/) (recommended) or any other provider.
2. Create a new PostgreSQL database (e.g., named `jobportal`).
3. Copy your project connection string. It will look like this:
   `postgresql://username:password@ep-xxxxx.region.aws.neon.tech/jobportal?sslmode=require`
   *(Ensure `sslmode=require` is present at the end of your connection URL so the serverless environments can connect securely over TLS).*

### Step 2: Configure Environment Variables on Vercel
When deploying your Next.js application to Vercel, configure your environment variables:
1. Go to your project on the **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2. Add the following keys:
   - `DATABASE_URL`: Add your cloud PostgreSQL connection string (copied in Step 1).
   - `NEXTAUTH_SECRET`: A secure random secret (generate via `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-domain.vercel.app`). If omitted, the app auto-derives it from `VERCEL_URL`.
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` *(optional)*: Enables GitHub sign-in. The button shows automatically when both are set.

### Step 3: Run Migrations on the Cloud Database
Before running the app or redeploying, push your Prisma schemas to your cloud database so the tables are created:
```bash
# Push database changes directly to your Cloud Postgres Database
npx prisma db push
```

### Step 4: Redeploy the Project
- Push your changes to Git (GitHub/GitLab) or trigger a manual redeployment inside Vercel Dashboard to build the application with the new configuration.

> **Vercel build:** `vercel.json` runs `prisma migrate deploy` before `next build` so production schema stays in sync. Ensure `DATABASE_URL` is set for the Production environment in Vercel.

---

## ✅ Production Readiness Checklist

Before going live, confirm the following:

| Item | Status |
|------|--------|
| **Environment variables** | `DATABASE_URL`, `NEXTAUTH_SECRET` (32+ chars), `NEXTAUTH_URL` (or Vercel auto from `VERCEL_URL`) |
| **Database migrations** | Run `npx prisma migrate deploy` against production DB (automated on Vercel via `vercel.json`) |
| **Health check** | `GET /api/health` returns `{ status: "ok", database: "connected" }` |
| **Security headers** | HSTS, X-Frame-Options, nosniff — configured in `next.config.ts` |
| **Env validation** | Runs at startup via `src/instrumentation.ts`; run `npm run validate:env` locally before deploy |
| **Auth hardening** | Secure cookies in production; dangerous email linking disabled in production |
| **Rate limiting** | Signup limited to 5 attempts/hour per IP (in-memory; use Redis for multi-instance scale) |
| **Protected routes** | Middleware guards `/dashboard`, `/jobs/post`, `/jobs/:id/edit` |
| **CI** | GitHub Actions runs lint + build on push/PR (`.github/workflows/ci.yml`) |
| **SEO** | Metadata in `layout.tsx`, `robots.ts`, and `sitemap.ts` |
| **Optional GitHub OAuth** | Separate OAuth apps for local vs production callback URLs |

### Pre-deploy commands

```bash
npm run validate:env   # verify env vars (with production vars exported)
npm run build          # local production build
npm run build:prod     # same as Vercel: migrate + build
```

### Post-deploy smoke test

```bash
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/auth/status
```

---

## 📂 Project Structure (MVC Pattern)

This project follows the **Model–View–Controller (MVC)** pattern. Each folder has **one job**:

| Layer | Folder | What it does |
|-------|--------|--------------|
| **Routes** | `src/app/` | URLs only — thin files that connect everything |
| **Controller** | `src/controllers/` | Business logic — validates input, calls models |
| **Model** | `src/models/` | Database access — talks to PostgreSQL via Prisma |
| **View** | `src/views/` | UI components — HTML/React, no database code |
| **Config** | `src/config/` | App setup — auth, database connection, env |
| **Utils** | `src/utils/` | Helpers — password hashing, form validation |

```
Request flow:

  Browser  →  app/ (route)  →  controller/  →  model/  →  Database
                  ↓
               views/ (UI)
```

### Quick reference — where to edit what

| I want to… | Edit this file |
|------------|----------------|
| Add a new page URL | `src/app/.../page.tsx` |
| Change how sign-up works | `src/controllers/auth.controller.ts` |
| Change a database query | `src/models/*.model.ts` |
| Change how a page looks | `src/views/**/*.tsx` |
| Change auth / OAuth setup | `src/config/auth.ts` |
| Change validation rules | `src/utils/validations/` |
| Change database tables | `prisma/schema.prisma` |

### Folder tree

```text
src/
├── app/                          # ROUTES (URLs) — keep these files small!
│   ├── api/                      #   API endpoints → call controllers
│   ├── auth/signin/page.tsx      #   /auth/signin
│   ├── auth/signup/page.tsx      #   /auth/signup
│   ├── dashboard/page.tsx        #   /dashboard
│   ├── jobs/                     #   /jobs, /jobs/:id, /jobs/post
│   └── layout.tsx                #   Root layout
│
├── controllers/                  # CONTROLLER — business logic
│   ├── auth.controller.ts        #   Register user, auth status
│   ├── job.controller.ts         #   Search, create, list jobs
│   └── application.controller.ts #   Apply to jobs, dashboard data
│
├── models/                       # MODEL — database queries only
│   ├── user.model.ts             #   User table
│   ├── job.model.ts              #   Job table
│   └── application.model.ts      #   Application table
│
├── views/                        # VIEW — UI only, no DB access
│   ├── auth/                     #   SignInView, SignUpView
│   ├── jobs/                     #   JobListView, JobDetailView, PostJobView
│   ├── dashboard/                #   DashboardView
│   └── layout/                   #   NavbarView
│
├── config/                       # App configuration
│   ├── auth.ts                   #   NextAuth + GitHub OAuth
│   ├── session.ts                #   getSession(), requireUserId()
│   ├── database.ts               #   Prisma client
│   └── env.ts                    #   Environment helpers
│
├── utils/                        # Shared helpers
│   ├── crypto.ts                 #   Password hash/verify
│   └── validations/              #   Zod schemas
│
├── providers/                    # React context (session)
└── types/                        # TypeScript definitions
```

### Example: posting a job (MVC flow)

```
1. VIEW     views/jobs/PostJobView.tsx     User fills the form
2. ROUTE    app/api/jobs/route.ts          Receives POST request
3. CONTROLLER  controllers/job.controller.ts  Validates data, checks auth
4. MODEL    models/job.model.ts            Saves to PostgreSQL
5. VIEW     Redirects user to home page
```

### Example: a page route (thin by design)

```typescript
// app/dashboard/page.tsx  — only 4 lines of logic!
const userId = await requireUserId();
const data = await ApplicationController.getDashboardData(userId);
return <DashboardView {...data} />;
```

---

## 📊 Database Schema Explained

Here is how the database models relate to each other:

1.  **User**: Represents anyone who signs in. A User can:
    *   Post multiple jobs (`Job[]`)
    *   Apply to multiple jobs (`Application[]`)
2.  **Job**: Represents a job opening posted by a user.
    *   Belongs to a creator (`postedBy` User).
    *   Can have multiple candidates (`applications` Application[]).
3.  **Application**: A join table linking a **User** and a **Job**.
    *   Ensures a unique pairing (`jobId` + `userId`) so users cannot apply to the same job twice.
    *   Tracks the state (`status`) of the application, defaulted to `"Pending"`.

---

## 💡 Beginner Practice Ideas

If you'd like to extend this application to build your skills, try implementing:

1.  🔍 **Search Filters**: Add search capability on the `/jobs` page to filter by job type (Full-time vs. Part-time) or by location.
2.  📝 **Update Application Status**: Allow employers to mark an application as **Accepted** or **Rejected** from their Dashboard.
3.  📄 **Resume Upload**: Add a field to upload a CV link or resume file when applying to a job.
4.  ⭐ **Job Bookmarks**: Allow users to save/bookmark jobs to apply to them later.

