# Deployment Guide for Sai Agalyas E-commerce

This guide will help you deploy your application to **Vercel** (Free Hosting) and **Neon.tech** (Free PostgreSQL Database).

## Prerequisites
1.  **GitHub Account**: To host your code.
2.  **Vercel Account**: To host the website.
3.  **Neon (or Supabase) Account**: To host the database.

---

## Step 1: Push to GitHub

1.  Create a new **Empty Repository** on GitHub (do not initialize with README).
2.  Run these commands in your terminal to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Set up Database (Neon.tech)

Vercel requires a cloud database (serverless functions cannot write to a local SQLite file).

1.  Sign up at [Neon.tech](https://neon.tech).
2.  Create a new project.
3.  Copy the **Connection String** (it looks like `postgres://user:pass@...`).
4.  **Important**: You need to switch your project to use PostgreSQL instead of SQLite.

### Switch to PostgreSQL
1.  Open `prisma/schema.prisma`.
2.  Change the provider from `"sqlite"` to `"postgresql"`:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
3.  Commit and push this change to GitHub.

## Step 3: Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** > **Project**.
3.  Import your GitHub repository.
4.  **Environment Variables**:
    Expand the "Environment Variables" section and add the following:

    | Name | Value | Description |
    |------|-------|-------------|
    | `DATABASE_URL` | `postgres://...` | Your Neon connection string (from Step 2) |
    | `NEXTAUTH_URL` | `https://your-project.vercel.app` | Your Vercel domain (you'll get this after deploy, initially put placeholder or leave empty if using Vercel Preview) |
    | `NEXTAUTH_SECRET` | `(generate a random string)` | Run `openssl rand -base64 32` to generate |
    | `AUTH_TRUST_HOST` | `true` | Required for Vercel |
    | `RAZORPAY_KEY_ID` | `...` | Your Razorpay Key |
    | `RAZORPAY_KEY_SECRET` | `...` | Your Razorpay Secret |

5.  Click **Deploy**.

## Step 4: Initialize the Database

Once deployed, the database is empty. You need to push your schema to it.

1.  On your local machine, create a `.env.production` file (or just rename `.env` temporarily) with your **Neon Database URL**:
    ```
    DATABASE_URL="postgres://user:pass@neon.tech/..."
    ```
2.  Run the migration command:
    ```bash
    npx prisma db push
    ```
3.  (Optional) Seed the database if you have a seed script, or just register a new Admin user via the Register page and manually change their role to `ADMIN` in the database (using Neon's SQL editor or Prisma Studio).

## Step 5: Finalize Configuration

1.  Once deployment is successful, Vercel will give you a domain (e.g., `sai-agalyas.vercel.app`).
2.  Go to Vercel Settings > Environment Variables.
3.  Update `NEXTAUTH_URL` to `https://sai-agalyas.vercel.app`.
4.  Redeploy (or go to Deployments > ... > Redeploy) for the changes to take effect.
