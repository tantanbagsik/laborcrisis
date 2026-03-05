# LaborCrisis

A full-featured job portal platform for connecting employers with skilled workers, built with Next.js 16 and MongoDB.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless), MongoDB Atlas
- **Database:** MongoDB
- **Deployment:** Vercel

## Features

### User Features
- User Registration & Login (Worker/Employer roles)
- Browse and Search Jobs
- Apply for Jobs
- Job Listings by Category, Location, Type
- User Profile Management

### Admin Panel
- Dashboard with Statistics
- Users Management (View, Change Role, Delete)
- Jobs Management (View, Change Status, Delete)
- Applications Management (View, Update Status, Delete)

## Project Structure

```
laborcrisis/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── jobs/        # Jobs endpoints
│   │   │   ├── applications/# Applications endpoints
│   │   │   └── admin/       # Admin endpoints
│   │   ├── admin/           # Admin Panel Pages
│   │   ├── jobs/            # Jobs listing page
│   │   ├── login/           # Login page
│   │   └── page.tsx         # Home page
│   ├── models/              # MongoDB Models
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── backend/                  # Express.js backend (deprecated)
├── public/                   # Static assets
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

For Vercel deployment, add these environment variables in Vercel Dashboard.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth` | Register/Login (action: register/login) |
| GET | `/api/auth` | Get current user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/featured` | Get featured jobs |
| GET | `/api/jobs/[id]` | Get single job |
| POST | `/api/jobs` | Create job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get applications |
| POST | `/api/applications` | Submit application |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/users` | Manage users |
| GET/POST | `/api/admin/jobs` | Manage jobs |
| GET/POST | `/api/admin/applications` | Manage applications |

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### MongoDB Atlas Setup

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Add IP to whitelist (use `0.0.0.0/0` for all IPs)
4. Get connection string

## Live URLs

- **Frontend:** https://laborcrisis.vercel.app
- **Admin Panel:** https://laborcrisis.vercel.app/admin

## Default Admin Account

Create admin user via MongoDB Compass or Atlas:
- Email: rpanganiban
- Password: Titankalimot08!
- Role: admin

## License

MIT
