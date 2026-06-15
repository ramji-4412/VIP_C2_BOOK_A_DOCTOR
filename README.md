# ArogyaMitra

ArogyaMitra is a full-stack doctor appointment booking application. Patients can register, find approved doctors, book and cancel appointments, receive notifications, apply as doctors, and manage their accounts. Admins can approve or reject doctor applications and review platform activity.

## Features

- JWT-based login and protected routes
- Patient dashboard with appointments, notifications, and profile summary
- Doctor search and appointment booking with optional medical document upload
- Appointment cancellation and clearable appointment history
- Notification system for booking, cancellation, doctor status updates, and same-day appointment reminders
- Doctor application flow with admin approval
- Admin dashboard for users, doctors, appointments, and statistics
- Account deletion flow with feedback capture
- Responsive React UI with reusable shell, sidebar, logo, and floating health quotes

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, Ant Design reset
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JSON Web Tokens
- Uploads: Multer

## Live Deployment

- Frontend: https://vip-c2-book-a-doctor-gold.vercel.app/login
- Backend: https://vip-c2-book-a-doctor-ntxa.onrender.com

The backend is hosted on Render's free tier, so the first request after inactivity can take 30-60 seconds while the service wakes up.

## Project Structure

```text
arogya-mitra/
  client/        React frontend
  server/        Express backend
```

## Prerequisites

- Node.js
- MongoDB connection string
- npm

## Backend Setup

```powershell
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_DB=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
```

Start the backend:

```powershell
npm start
```

The backend runs on `http://localhost:5000` by default.

## Frontend Setup

```powershell
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

If your backend URL is different, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

This project is deployed from GitHub using:

- MongoDB Atlas for the database
- Render for the Express backend
- Vercel for the React frontend

### 1. Deploy Backend On Render

Create a Render Web Service from the GitHub repository.

Use these settings:

```text
Runtime: Node
Branch: main
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

Add these Render environment variables:

```env
MONGO_DB=your_mongodb_atlas_connection_string
JWT_KEY=your_jwt_secret
PORT=5000
```

After deployment, test the backend URL:

```text
https://vip-c2-book-a-doctor-ntxa.onrender.com/
```

Expected response:

```text
ArogyaMitra Backend Running
```

### 2. Deploy Frontend On Vercel

Create a Vercel project from the same GitHub repository.

Use these settings:

```text
Framework Preset: Vite
Root Directory: client
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```env
VITE_API_URL=https://vip-c2-book-a-doctor-ntxa.onrender.com/api
```

Redeploy the frontend after adding or changing `VITE_API_URL`.

## Useful Commands

Frontend:

```powershell
cd client
npm run lint
npm run build
```

Backend syntax check examples:

```powershell
cd server
node -c controllers/userController.js
node -c routes/userRoutes.js
```

## Notes

- `node_modules`, `.env`, `client/dist`, and `server/uploads` are intentionally ignored.
- Uploaded appointment documents are runtime files and should not be committed.
- Restart the backend after changing server controllers, routes, or middleware.
