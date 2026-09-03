# 💼 Enterprise Job Board Platform

![Hero Preview](./public/hero-preview.jpg)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)]()

</div>

---

## 🌟 Key Features

- 🔐 **Role-Based Access Control (RBAC)**: Strict role segregation for **JOB_SEEKER**, **EMPLOYER**, and **ADMIN** users.
- 🏢 **Employer Dashboard**: Real-time analytics cards (*Posted Jobs*, *Total Applicants*, *Pending Reviews*, *Accepted Hires*), candidate cover letter previews, resume links, and 1-click status management (*Accept* / *Reject*).
- 📄 **Job Seeker Experience**: Interactive candidate application modal with cover letter & portfolio attachments, status timeline tracking, and application withdrawal options.
- 🔍 **Advanced Search & Filtering**: Multi-field search by keyword, category, job type, experience level, location, and active status.
- 🔖 **Saved Jobs & Bookmarking**: Save/bookmark open roles to review or apply later.
- ⚡ **Resilient Authentication**: NextAuth.js v4 with salted `scrypt` password hashing and optional GitHub OAuth 2.0 fallback.
- 🌐 **Dynamic OpenGraph SEO**: Dynamic `generateMetadata` implementation generates custom social media preview cards for job links.
- 🛠️ **Production-Ready & Self-Healing**: Vercel dynamic host resolution, database health checks at `/api/health`, and comprehensive integration test coverage.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Feature / Permission | Guest | Job Seeker | Employer | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Browse / Search Jobs** | ✅ | ✅ | ✅ | ✅ |
| **View Job Details & Dynamic SEO** | ✅ | ✅ | ✅ | ✅ |
| **Bookmark / Save Job** | ❌ (Sign In) | ✅ | ❌ | ✅ |
| **Apply with Cover Letter & Resume** | ❌ (Sign In) | ✅ | ❌ (Forbidden 403) | ❌ |
| **Withdraw Active Application** | ❌ | ✅ (Own Apps) | ❌ | ✅ |
| **Post Job Opening** | ❌ (Sign In) | ❌ (Redirect + Banner) | ✅ | ✅ |
| **Edit / Delete Job Opening** | ❌ | ❌ | ✅ (Own Jobs) | ✅ |
| **Manage Applicants (Accept / Reject)** | ❌ | ❌ | ✅ (Own Jobs) | ✅ |
| **Tailored Dashboard Overview** | ❌ | ✅ (Seeker View) | ✅ (Employer View) | ✅ (Admin View) |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/) & [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL (Neon Cloud)](https://neon.tech/) & [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) (JWT Strategy + Prisma Adapter)
- **Validation**: [Zod](https://zod.dev/)
- **Dates & Helpers**: `date-fns`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/md-shaquib007/Job-Portal-NextApp.git
cd job-posting-website
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database connection string (PostgreSQL / Neon)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-empty-lab-atg0s3ut.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-random-secret-at-least-32-characters-long"

# Optional: GitHub OAuth 2.0
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Sync Database & Seed Demo Data

```bash
# Push database schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Optional: Seed demo accounts and jobs
npm run db:seed
```

### 🔑 Demo Tour Credentials (All 3 Roles)

| Role / Account Type | Email Address | Password | Tour Highlights & Capabilities |
| :--- | :--- | :--- | :--- |
| 👑 **Admin Account** | `admin@demo.com` | `demoPass1` | Full platform moderation & system overview |
| 👔 **Employer Account** | `employer@demo.com` | `demoPass1` | Post & edit jobs, review candidate cover letters & resumes (*Accept / Reject*) |
| 👤 **Job Seeker Account** | `seeker@demo.com` | `demoPass1` | Search jobs with filters, apply with cover letter, track & withdraw applications |

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Integration tests (requires server running on port 3000)
npm test
```

---

## 📄 License

This project is licensed under the MIT License. Created by [Md Shaquib](https://github.com/md-shaquib007).
