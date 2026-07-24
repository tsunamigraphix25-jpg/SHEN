# SHEN Knowledge Hub

A simple Next.js blog/publication platform for SHEN with an admin-only content management portal.

## Features

- Public blog-style homepage
- Articles, research, news, events, and gallery sections
- Admin login portal for publishing content
- Neon PostgreSQL database support through Drizzle ORM
- Research items can link to Google Drive PDFs through the `pdfUrl` field

## Local setup

1. Install dependencies:

   npm install

2. Create a `.env.local` file with your database connection string:

   DATABASE_URL=postgresql://<user>:<password>@<host>/<database>

3. Start the development server:

   npm run dev

4. Open the app at:

   http://localhost:3000

## Admin login

Use the admin credentials set in the database seed or your Neon database.

The default login page is:

- `/admin`

## Deploying to GitHub Pages-style hosting

This project is a Next.js app and is best deployed on a Node-compatible platform such as:

- Vercel
- Railway
- Render
- AWS Amplify

For GitHub deployment, the recommended route is to push the repository to GitHub and deploy it from a hosting platform that supports Next.js server-side rendering.

## Neon setup notes

- Use your Neon connection string in `DATABASE_URL`
- Make sure the Drizzle schema is applied to your Neon database
- The `articles` table is the main content table
- For research posts, keep the article body in the content and store the PDF link in the `pdfUrl` field

## Important product direction

This project is now aligned to a blog-first model:

- No public submit form is required
- Only the admin login is used to add and manage content
- Research entries can point to external Google Drive PDF links
