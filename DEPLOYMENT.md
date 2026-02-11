# Deployment Guide: Vercel + MongoDB Atlas

This guide explains how to deploy your "tamilcreations" e-commerce application for free using Vercel (frontend/backend) and MongoDB Atlas (database).

## Prerequisites

-   A GitHub account (where your code is hosted).
-   A Vercel account (free).
-   A MongoDB Atlas account (free).

## Step 1: Set up MongoDB Atlas (Free Database)

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  **Create a Cluster**:
    -   Choose the **Shared** (Free) option.
    -   Select a region (e.g., AWS / Singapore or a region close to you).
    -   Click **Create Cluster**.
3.  **Create a Database User**:
    -   Go to **Database Access** in the sidebar.
    -   Click **Add New Database User**.
    -   Choose "Password" authentication.
    -   Enter a username (e.g., `tamil-admin`) and a strong password. **Write these down!**
    -   Grant "Read and write to any database" privileges.
    -   Click **Add User**.
4.  **Allow Network Access**:
    -   Go to **Network Access** in the sidebar.
    -   Click **Add IP Address**.
    -   Select **Allow Access from Anywhere** (0.0.0.0/0). This is required for Vercel to connect.
    -   Click **Confirm**.
5.  **Get Connection String**:
    -   Go to **Database** (Cluster view).
    -   Click **Connect**.
    -   Select **Drivers** (Node.js).
    -   Copy the connection string. It will look like:
        `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    -   Replace `<username>` and `<password>` with the user details you created in step 3.
    -   **Important**: Add the database name after the domain slash. e.g., `...mongodb.net/tamilcreations?retry...`

## Step 2: Push Code to GitHub

Ensure your latest code (with the MongoDB migration changes) is pushed to your GitHub repository.

```bash
git add .
git commit -m "Migrate to MongoDB"
git push
```

## Step 3: Deploy to Vercel

1.  **Import Project**:
    -   Log in to [Vercel](https://vercel.com/).
    -   Click **Add New...** > **Project**.
    -   Import your `tamilcreations-ecommerce` repository.
2.  **Configure Project**:
    -   Framework Preset: **Next.js** (should be auto-detected).
    -   Root Directory: `./` (default).
3.  **Environment Variables**:
    -   Expand the **Environment Variables** section.
    -   Add the following variables:
        -   `DATABASE_URL`: The MongoDB connection string from Step 1.
        -   `NEXTAUTH_SECRET`: A random long string (you can generate one with `openssl rand -base64 32` or just type a long random phrase).
        -   `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://your-project.vercel.app`). *Note: On first deploy, Vercel might not know the URL yet. You can set this to `http://localhost:3000` initially or update it after the first failed deploy once you get the URL.*
        -   `RAZORPAY_KEY_ID`: Your Razorpay Test Key ID.
        -   `RAZORPAY_KEY_SECRET`: Your Razorpay Test Key Secret.
4.  **Deploy**:
    -   Click **Deploy**.

## Maintenance

### Resetting the Database
To clear all data during development/testing, you can run the reset script locally (connected to your remote DB):

1.  Update your local `.env` with the MongoDB connection string.
2.  Run:
    ```bash
    node scripts/reset-db.js
    ```
