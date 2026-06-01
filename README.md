# 💼 Job Board Application

Welcome to the **Job Board Application**! This is a modern, full-stack web application designed to connect job seekers with employers. Users can browse listed jobs, view job details, apply with a single click, post new jobs, and track application statuses through a personalized dashboard.

This project is built using **Next.js (App Router)**, **Prisma**, **PostgreSQL**, **NextAuth.js**, and **Tailwind CSS**. It is designed with beginner-friendly structures and patterns, making it a great codebase to learn or expand upon.

---

## 🚀 Key Features

*   🔒 **Secure Authentication**: Authentication powered by NextAuth.js utilizing **GitHub OAuth**.
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

# Connection string for your PostgreSQL database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

# Credentials for GitHub OAuth (See below on how to obtain these)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

#### `.env.local` File
```env
# NextAuth settings
NEXTAUTH_URL="http://localhost:3000"

# A secure random string used to hash tokens. 
# You can generate a good one in terminal using: openssl rand -base64 32
NEXTAUTH_SECRET="your_nextauth_secret_key"
```

> [!NOTE]
> **How to get GitHub Client ID & Secret:**
> 1. Go to your GitHub account settings -> **Developer Settings** -> **OAuth Apps** -> **New OAuth App**.
> 2. Set **Application Name** to `Job Board`.
> 3. Set **Homepage URL** to `http://localhost:3000`.
> 4. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
> 5. Register the application, copy the **Client ID**, and click **Generate a new client secret** to copy the secret key.

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

---

## 📂 Project Structure

Here is a quick overview of the key folders in this codebase:

```text
├── prisma/
│   └── schema.prisma        # Database schema models (User, Job, Application, Session)
├── public/                  # Static assets (images, icons)
└── src/
    ├── app/                 # Next.js pages, routing, and APIs
    │   ├── api/             # Backend API routes (e.g. NextAuth handlers, job APIs)
    │   ├── auth/            # Authentication pages (Sign-in page)
    │   ├── dashboard/       # User dashboard page layout and stats
    │   ├── jobs/            # Job pages (Browse, Job Details, Post Job form)
    │   ├── layout.tsx       # Root layout structure
    │   └── page.tsx         # Landing page (Home)
    ├── components/          # Reusable React components (Navbar, etc.)
    ├── lib/                 # Shared utilities, Prisma client, NextAuth configs
    │   ├── auth.ts          # GitHub Provider & Session config for NextAuth
    │   ├── prisma.ts        # Singleton instance of Prisma Client
    │   └── validations/     # Zod validation schemas for forms
    └── types/               # TypeScript type definitions
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

