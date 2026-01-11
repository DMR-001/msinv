# Deployment Guide for MS Innovatics

This application is built with **Node.js (Express)** and uses **Neon DB (PostgreSQL)**. It is ready to be deployed on platforms like Render or Railway.

## Prerequisites
1.  **GitHub Account**: Push your code to a GitHub repository.
2.  **Neon DB**: You already have this set up. Keep your connection string handy.

## Option 1: Deploy on Render.com (Recommended)

1.  **Create a New Web Service**:
    *   Log in to Render and click "New +".
    *   Select "Web Service".
    *   Connect your GitHub repository.

2.  **Configure Service**:
    *   **Name**: `ms-innovatics` (or similar).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `node server.js`.

3.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add `DATABASE_URL`: (Paste your Neon DB connection string).
    *   Add `JWT_SECRET`: (Create a strong random string).
    *   Add `PORT`: `3000` (Render acts on port, usually irrelevant as they inject it, but good to have).

4.  **Deploy**:
    *   Click "Create Web Service".
    *   Render will build and deploy your app.

## Option 2: Deploy on Railway.app

1.  **New Project**:
    *   Log in and click "New Project" -> "Deploy from GitHub repo".
    *   Select your repo.

2.  **Variables**:
    *   Go to the "Variables" tab.
    *   Add `DATABASE_URL` and `JWT_SECRET`.

3.  **Deploy**:
    *   Railway will automatically detect `package.json` and `server.js`.

## Important Notes
*   **Database**: Since you are using Neon DB, your data (Users, Products) will persist regardless of where you host the backend.
*   **Admin Access**: After deployment, you might need to run the promotion script again or manually update the DB to make yourself an admin on the live site, OR just register with the same email if you are using the same DB.
