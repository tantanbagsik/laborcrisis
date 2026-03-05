# Labor Crisis

A job portal website for connecting employers with skilled workers.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

## Project Structure

```
laborcrisis/
├── src/app/              # Next.js frontend
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server
│   └── package.json
├── public/               # Static assets
└── package.json
```

## Getting Started

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/laborcrisis
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/worker/:id` - Get worker's applications
- `GET /api/applications/job/:id` - Get job's applications

## Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Render/Railway)
1. Connect GitHub repo to Render/Railway
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

## Live URLs

- **Frontend:** https://laborcrisis.vercel.app
- **Backend:** (Deploy to Render/Railway)

## License

MIT
