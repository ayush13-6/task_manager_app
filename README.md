# Task manager — React + Tailwind + Node.js + MongoDB

Clean, simple full-stack Task Manager built with Tailwind CSS.

## Tech Stack
- **Frontend:** Reactjs, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3000
```

Visit **https://task-manager-app-ruddy-mu.vercel.app**

## API Routes
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Toggle status |
| DELETE | `/api/tasks/:id` | Delete task |
