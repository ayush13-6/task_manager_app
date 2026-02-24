# TaskFlow v2 — React + Tailwind + Node.js + MongoDB

Clean, simple full-stack Task Manager rebuilt with Tailwind CSS.

## Tech Stack
- **Frontend:** Reactjs, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # set your MONGO_URI
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3000
```

Open **http://localhost:3000**

## API Routes
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Toggle status |
| DELETE | `/api/tasks/:id` | Delete task |
