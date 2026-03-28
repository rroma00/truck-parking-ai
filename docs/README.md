# ParkAI (Truck Parking AI)

Welcome to the technical documentation for **ParkAI**, a comprehensive intelligent truck parking platform.

## What is ParkAI?
ParkAI is a system designed to help truck drivers find, reserve, and manage parking spaces effectively. The platform consists of two main pieces:
1. **Frontend**: A React/Vite dashboard allowing users to interact with the application.
2. **Backend**: A robust Node.js and Express REST API that handles logic, reservations, availability, and database interactions.

## Documentation Index

Please refer to the following documents to understand the system comprehensively:

- [System Architecture](ARCHITECTURE.md): Details about how the frontend and backend interact and the technology stack.
- [Deployment Guide](DEPLOYMENT.md): Step-by-step instructions on deploying the API to Railway and the Frontend to Vercel.
- [UI Migration Log](MIGRATION_WALKTHROUGH.md): Details about the 2026 UI overhaul to the "Precision Architect" design system.
- [Work Log 2026-03-22](WORKLOG_2026-03-22.md): Day-by-day setup and UI implementation notes from March 22, 2026.
- [Work Log 2026-03-23](WORKLOG_2026-03-23.md): Customer Management routing, UI work, local verification, and git activity from March 23, 2026.

## Getting Started Locally

To run the project locally, you can use the convenience scripts in the root directory:

### 1. Backend
```bash
# Start the server.js backend
npm start
```
The backend will typically run on `http://localhost:3000`.

### 2. Frontend
```bash
# Start the Vite dashboard development server
npm run dev
```
The frontend will configure itself to talk to your backend through the `VITE_API_BASE_URL` environment variable.

### 3. Build & Deploy
```bash
# To generate a production build of the dashboard
npm run build
```
