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
MONGO_URL=your_mongodb_connection_string
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
