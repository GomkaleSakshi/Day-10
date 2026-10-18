# Smart Facility Management System

This project is a full-stack facility management application built for the Day-10 final project. It includes a React admin dashboard, a separate Angular facility management module, and an Express REST API backed by MySQL.

## Overview

The system helps facility managers track facilities, schedule inspections, manage complaints, and monitor operational health through a clean dashboard with charts and actionable tables.

## Objectives

- Centralize facility operations and maintenance data.
- Provide a dashboard for high-level operational insights.
- Manage facilities, inspections, and complaints using real APIs.
- Demonstrate end-to-end integration between React, Angular, Express, and MySQL.
- Support a final-year engineering project with documentation and testing.

## Features

- Dashboard with KPI cards and charts.
- Facility CRUD with search and filtering.
- Inspection tracking with facility association.
- Complaint management with priority and resolution workflow.
- REST API with validation, error handling, and MySQL integration.
- Angular facility module consuming the same backend.
- MySQL schema and seed data for realistic demo records.

## Technology Stack

- React + Vite + TypeScript
- Angular + TypeScript
- Express.js + Node.js
- MySQL + mysql2
- Recharts
- React Router
- Axios
- Angular HttpClient

## Architecture

- Frontend React app: admin dashboard and management screens
- Angular module: facility management interface that connects to the same backend
- Backend Express API: handles CRUD and dashboard metrics
- MySQL database: persistent state for facilities, inspections, and complaints

## Folder Structure

- frontend/
- angular-module/
- backend/
- database/
- ml/
- README.md

## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+
- Git

## MySQL Setup

1. Install MySQL Community Server and start the service.
2. Create a database named smart_facility_db.
3. Configure your backend environment using backend/.env.

## Database creation

```bash
mysql -u root -p
CREATE DATABASE smart_facility_db;
```

## Schema import

```bash
mysql -u root -p smart_facility_db < database/schema.sql
```

## Seed import

```bash
mysql -u root -p smart_facility_db < database/seed.sql
```

## Environment configuration

Create backend/.env based on backend/.env.example.

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_facility_db
FRONTEND_URL=http://localhost:5173
ANGULAR_URL=http://localhost:4200
```

Frontend environment is configured in frontend/.env.example and Angular environment is configured in angular-module/src/environments/environment.ts.

## Backend startup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The API will run at http://localhost:5000/api.

## React startup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The React app will run at http://localhost:5173.

## Angular startup

```bash
cd angular-module
npm install
npm run start
```

The Angular app will run at http://localhost:4200.

## API Endpoints

- GET /api/health
- GET /api/dashboard
- GET /api/facilities
- GET /api/facilities/:id
- POST /api/facilities
- PUT /api/facilities/:id
- PATCH /api/facilities/:id
- DELETE /api/facilities/:id
- GET /api/inspections
- GET /api/inspections/:id
- POST /api/inspections
- PUT /api/inspections/:id
- PATCH /api/inspections/:id
- DELETE /api/inspections/:id
- GET /api/complaints
- GET /api/complaints/:id
- POST /api/complaints
- PUT /api/complaints/:id
- PATCH /api/complaints/:id
- DELETE /api/complaints/:id

## Testing

```bash
cd backend
npm test
```

## Build commands

```bash
cd frontend
npm run build

cd ../angular-module
npm run build
```

## Troubleshooting

- If MySQL is not installed, install it and create the database manually.
- If the backend cannot connect, verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME.
- If React or Angular cannot reach the API, ensure the backend is running and CORS is configured.
- Check that the database schema has been imported before creating data.

## Screenshots

Screenshots will be added later once the UI is used in a local browser session.

## Future enhancements

- Role-based access control.
- Email notifications for complaints and inspections.
- Audit logs and reporting exports.
- File uploads for facility images or inspection evidence.

## Known limitations

- This project is a training project and intentionally focuses on core CRUD and dashboard functionality.
- MySQL must be installed locally for full database-backed behavior.
- Some features require local environment configuration and a running database service.

## ML note

This project uses the Web Development track, not an AI/ML module. The ml/ folder contains documentation explaining that no model is included in this implementation.
