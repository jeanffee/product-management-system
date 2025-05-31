# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack Product Management System with separate frontend and backend components:

- **Backend** (`/backend/`): Node.js/Express REST API with SQLite database
- **Frontend** (`/product-admin/`): Vue.js 3 SPA with Ant Design Vue UI components
- **Communication**: HTTP REST API calls via centralized service layer (`src/services/api.js`)

## Development Commands

### Backend Development
```bash
cd backend
npm run dev        # Start development server with hot reload
npm run init-db    # Initialize SQLite database with sample data
npm start          # Production server
```

### Frontend Development  
```bash
cd product-admin
npm run dev        # Start Vite dev server (usually :5173)
npm run build      # Production build
npm run preview    # Preview production build
```

### Testing & Quality
```bash
cd product-admin
npm run test:unit  # Run Vitest unit tests
npm run test:e2e   # Run Playwright E2E tests
npm run lint       # ESLint with auto-fix
npm run format     # Prettier formatting
```

## Key Technologies

- **Backend**: Node.js ES Modules, Express.js, SQLite3, Multer (file uploads)
- **Frontend**: Vue.js 3 Composition API, Vite, Ant Design Vue, Pinia (state), Vue Router
- **Testing**: Vitest (unit), Playwright (E2E), ESLint + Prettier

## Important File Locations

- **API Service**: `product-admin/src/services/api.js` - Centralized HTTP client
- **Database Init**: `backend/init-db.js` - SQLite schema and sample data
- **Routes**: `backend/routes/` - Express route handlers
- **Views**: `product-admin/src/views/` - Vue page components
- **Backend Config**: `backend/server.js` - Express app configuration

## Development Notes

- Backend uses ES Modules (`"type": "module"` in package.json)
- Frontend uses Vite with HMR for fast development
- Database is SQLite file-based (auto-created on first run)
- CORS configured for localhost development
- Both components have hot reload enabled in development mode