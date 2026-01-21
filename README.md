
[Uploading README.md…]()
📦 Storage Management Solution (Easy-Store)

A cloud-based storage management system similar to Google Drive that allows users to securely upload, organize, share, and manage files with role-based permissions.

🚀 Features
🔐 Authentication

Signup, Login, Logout using JWT

Password encryption with bcrypt

Google OAuth integration

Secure API routes using middleware

📁 File & Folder Management

Upload files to cloud storage (Supabase/Firebase)

Create, rename, delete files and folders

Folder hierarchy support

Trash (Soft Delete) feature

🔗 Sharing & Permissions

Share files using unique links

Role-based access (Owner, Editor, Viewer)

Secure signed URLs for file access

🔍 Search & Performance

Full-text search

Pagination and lazy loading

Optimized database queries

🎨 Frontend UI

Google Drive-style dashboard

Drag-and-drop file upload

File preview (Images, PDFs, Text)

Responsive design

🛠️ Tech Stack
Frontend

Next.js

Tailwind CSS

TypeScript

Backend

Node.js

Express.js

Database & Storage

PostgreSQL

Supabase / Firebase Storage

📂 Project Structure
storage-management-solution/
│
├── app/              # Next.js frontend
├── components/
├── hooks/
├── lib/
├── public/
│
├── backend/          # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│
└── README.md


1️⃣ Frontend Setup
npm install
npm run dev

Frontend runs on:
http://localhost:3000

2️⃣ Backend Setup
cd backend
npm install
npx nodemon -r dotenv/config server.js

Backend runs on:
http://localhost:5000
