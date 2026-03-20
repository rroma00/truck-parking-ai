# System Architecture

The ParkAI system uses a decoupled client-server architecture. This separation ensures that the frontend presentation layer and the backend logic layer can scale, be developed, and be deployed entirely independently.

## Technology Stack

### Frontend (Dashboard)
- **Framework**: React.js with Vite (`dashboard/` directory).
- **Routing**: `react-router-dom` for handling UI navigation without page reloads.
- **HTTP Client**: `axios` for making API requests to the Node.js backend.
- **Build Tool**: Vite (extremely fast frontend tooling).

### Backend (API)
- **Runtime**: Node.js.
- **Framework**: Express.js REST Framework.
- **Database**: Supabase (PostgreSQL underneath the hood).
- **Core Files**: `server.js` serves as the entrypoint for the backend. `supabaseClient.js` negotiates data with the database.

## System Flow

1. **User Interaction**: A user interacts with the React Dashboard in their browser (e.g., viewing parking reservations).
2. **API Request**: The frontend uses `axios` to send an HTTP GET or POST request to the backend. The destination URL is defined by `VITE_API_BASE_URL`.
3. **Processing**: The Express `server.js` intercepts the request. It performs validation or authorization if required.
4. **Data Layer**: The Node.js server queries Supabase (PostgreSQL) using the Supabase client.
5. **Response**: Data is extracted, serialized into JSON, and sent back across the network to the React frontend, which then updates the UI.

## Repository Structure

```text
parkflow/
├── dashboard/             # React/Vite Frontend
│   ├── src/               # UI Components and Services
│   ├── package.json       # Frontend Dependencies
│   └── vite.config.js     # Build Configuration
├── services/              # Specific Node.js Services
├── .env                   # Local Environment Variables
├── server.js              # Express Backend Entry Point
└── package.json           # Backend Dependencies
```
