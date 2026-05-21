# 🚀 Team Task Manager

A modern full-stack task/project management platform where teams can create projects, manage tasks, assign work, and track progress with role-based access control (Admin/Member).

## ✨ Features

- **Authentication** — JWT-based signup, login, logout with persistent sessions
- **Role-Based Access** — Admin & Member roles with granular permissions
- **Project Management** — Create, edit, delete projects with team member assignment
- **Task Management** — Full CRUD with status, priority, due dates, and assignment
- **Dashboard** — Real-time stats, Chart.js visualizations, recent activity
- **Search & Filter** — Filter tasks by status, priority; search by title
- **Dark/Light Theme** — Toggle with localStorage persistence
- **Responsive Design** — Mobile-first with collapsible sidebar
- **Kanban View** — Project details with Kanban-style task columns
- **Overdue Indicators** — Visual warnings for overdue tasks

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| State | React Context API |
| HTTP | Axios with interceptors |
| Charts | Chart.js + react-chartjs-2 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |

## 📁 Project Structure

```
team-task-manager/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth & Theme context
│   │   ├── layouts/           # Main layout with sidebar
│   │   ├── pages/             # Route pages
│   │   └── services/          # API service layer
│   ├── railway.json           # Railway deploy config
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── config/                # Database config
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth & validation
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Token & seed utilities
│   ├── railway.json           # Railway deploy config
│   └── server.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

### 4. Seed Database (optional)
```bash
cd ../server
npm run seed
```

This creates sample data with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | admin123 |
| Member | sarah@taskmanager.com | member123 |
| Member | mike@taskmanager.com | member123 |
| Member | emily@taskmanager.com | member123 |

### 5. Run Development Servers
```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/signup | Public | Register new user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/me | Private | Get current user |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/projects | Private | Get all projects |
| GET | /api/projects/:id | Private | Get project details |
| POST | /api/projects | Admin | Create project |
| PUT | /api/projects/:id | Admin | Update project |
| DELETE | /api/projects/:id | Admin | Delete project + tasks |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/tasks | Private | Get tasks (filtered by role) |
| GET | /api/tasks/stats | Private | Get dashboard statistics |
| POST | /api/tasks | Admin | Create task |
| PUT | /api/tasks/:id | Private | Update task (members: status only) |
| DELETE | /api/tasks/:id | Admin | Delete task |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Private | Get all users |

## 🌐 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000   # Leave empty when using Vite proxy
```

## 🚂 Railway Deployment

1. Push code to GitHub
2. Create a new Railway project
3. Add **MongoDB** plugin or use MongoDB Atlas
4. Deploy **server/** as a service — set env vars
5. Deploy **client/** as a service — set `VITE_API_URL` to backend URL
6. Update `CLIENT_URL` in backend to frontend URL

## 📄 License

MIT
