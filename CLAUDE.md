# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LTI (Sistema de Seguimiento de Talento) is a full-stack talent tracking system with:
- **Backend**: Express + TypeScript + Prisma ORM
- **Frontend**: React (Create React App) + TypeScript
- **Database**: PostgreSQL (Docker)

The project is structured as a monorepo with separate `backend/` and `frontend/` directories.

## Development Commands

### Initial Setup

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start PostgreSQL database
docker-compose up -d

# Generate Prisma client
cd backend
npm run prisma:generate
```

### Running the Application

```bash
# Backend (http://localhost:3010)
cd backend
npm run dev

# Frontend (http://localhost:3000)
cd frontend
npm start
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# Production build and run (backend)
cd backend
npm run start:prod
```

### Database

PostgreSQL runs in Docker with:
- Host: localhost:5432
- User: `LTIdbUser`
- Password: `D1ymf8wyQEGthFR1E9xhCq`
- Database: `LTIdb`

Prisma commands:
```bash
cd backend
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:init      # Initialize Prisma (already done)
```

## Architecture

### Backend (Port 3010)

- **Entry point**: `backend/src/index.ts`
- **Database**: Prisma Client initialized in index.ts and exported for use throughout the app
- **Schema**: `backend/prisma/schema.prisma` - Currently has a simple `User` model
- **Tests**: Located in `backend/src/tests/`
- **Tech stack**: Express, Prisma, TypeScript, Jest

The backend uses:
- `ts-node-dev` for development with hot reload
- Environment variables via `dotenv` (DATABASE_URL required)
- Swagger for API documentation (dependencies installed)

### Frontend (Port 3000)

- **Entry point**: `frontend/src/index.tsx`
- **Main component**: `frontend/src/App.tsx`
- **Tests**: Located in `frontend/src/tests/`
- **Tech stack**: React 18, TypeScript, React Testing Library, Jest

Standard Create React App structure with TypeScript template.

## Key Considerations

- **Prisma workflow**: After modifying `backend/prisma/schema.prisma`, run `npm run prisma:generate` to update the Prisma client
- **Database connection**: Ensure PostgreSQL is running via `docker-compose up -d` before starting the backend
- **Environment variables**: Backend requires `.env` file with `DATABASE_URL` pointing to PostgreSQL
- **Port conflicts**: Backend uses 3010, frontend uses 3000, PostgreSQL uses 5432
- **Monorepo structure**: Always `cd` into the correct directory (backend/frontend) before running commands
