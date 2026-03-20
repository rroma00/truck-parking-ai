# ParkAI (Truck Parking AI)

Welcome to the technical documentation for **ParkAI**, a comprehensive intelligent truck parking platform.

## What is ParkAI?
ParkAI is a system designed to help truck drivers find, reserve, and manage parking spaces effectively. The platform consists of two main pieces:
1. **Frontend**: A React/Vite dashboard allowing users to interact with the application.
2. **Backend**: A robust Node.js and Express REST API that handles logic, reservations, availability, and database interactions.

## Documentation Index

Please refer to the following documents to understand the system comprehensively:

- [System Architecture](ARCHITECTURE.md): Details about how the frontend and backend interact, and the technology stack.
- [Deployment Guide](DEPLOYMENT.md): Step-by-step instructions on deploying the API to Railway and the Frontend to Vercel.

## Getting Started Locally

To run the project locally, you will need two terminal windows:

### 1. Backend
```bash
cd services
# or root, depending on where your server.js is
npm install
node server.js
```
The backend will typically run on `http://localhost:3000`.

### 2. Frontend
```bash
cd dashboard
npm install
npm run dev
```
The frontend will configure itself to talk to your backend through the `VITE_API_BASE_URL` environment variable defined in your local `.env`.
