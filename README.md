# Product Dashboard Frontend

Multi-website product management dashboard built with React, TypeScript, and TailwindCSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

### Authentication
- Simple admin login (credentials from backend .env)
- Protected routes
- Persistent session with localStorage

### Dashboard
- Overview of all brands (Azure, Monsini, Risky)
- Version status (published/draft)
- Product counts per brand

### Upload Wizard
- Multi-step upload process:
  1. Select brand, year, version name
  2. Upload Excel file
  3. Upload product images
  4. Validation summary
  5. Upload to server
- Frontend validation:
  - Excel structure validation
  - Image matching (supports STYLE, STYLE (1), STYLE_1, STYLE-1)
  - Duplicate detection
  - Missing images alert
  - Orphan images warning
- Overwrite confirmation for existing versions

### Product Management
- Filterable product table (style search, year, version, division)
- Pagination
- Version publishing (atomic transaction)
- Delete version with all products
- Delete individual products
- Color badges and image counts

### UI Components
- Shadcn-style components (Button, Input, Card, Table, Badge, etc.)
- Dark mode support (via CSS variables)
- Responsive layout
- Toast notifications (react-hot-toast)
- Modal confirmations (SweetAlert2)

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **XLSX** - Excel parsing
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **SweetAlert2** - Modals

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Shadcn-style base components
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── ProtectedRoute.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Upload.tsx
│   └── Products.tsx
├── context/         # React context
│   └── AuthContext.tsx
├── lib/             # Utilities
│   ├── api.ts       # Axios instance
│   └── utils.ts     # Helper functions
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main app with routing
└── main.tsx         # Entry point
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

For production, update this to your backend URL:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

The frontend runs on `http://localhost:5173` and makes API requests to the backend URL specified in `.env`.

### API Configuration

API base URL is configured in `src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

All API endpoints are centralized in `src/config/api.config.ts` for easy management.

