# Task Manager — Django REST Framework & React

A full-stack Task Manager application inspired by Todoist, built using Django REST Framework and React.

The application allows users to securely manage tasks, organize categories, track progress, and monitor deadlines through a responsive web interface.

## Live Application

- **Frontend (Vercel):** https://task-manager-eta-ashy-35.vercel.app/
- **Backend (Render):** https://task-manager-wkhw.onrender.com/
- **GitHub Repository:** https://github.com/Sumiya0311/task-manager

> Note: The Render free instance may take additional time to respond after inactivity.

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT authentication
- MySQL (local development)
- PostgreSQL (production)
- django-filter
- django-cors-headers
- Gunicorn
- WhiteNoise

### Frontend
- React.js
- Vite
- JavaScript
- React Router
- Axios
- CSS

### Deployment
- GitHub — Source code management
- Vercel — Frontend hosting
- Render — Backend hosting
- PostgreSQL — Production database

## Features

### Authentication
- User registration and login
- JWT access and refresh tokens
- Protected routes
- User profile information
- Change password
- Logout

### Task Management
- Create, view, edit, and delete tasks
- Mark tasks as complete or incomplete
- Task priorities: Low, Medium, High
- Task statuses: To Do, In Progress, Done
- Due date management
- Search tasks
- Filter tasks by status, priority, category, and due date
- Sort tasks
- Paginated task listing

### Category Management
- Create categories
- View categories
- Update categories
- Delete categories
- Organize tasks by category

### Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Task completion progress

## Project Structure

```text
task-manager/
├── backend/
│   ├── accounts/
│   ├── tasks/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
├── screenshots/
├── .gitignore
└── README.md
```

## Local Setup

### Prerequisites

Install the following:

- Python 3.10 or later
- Node.js and npm
- MySQL
- Git

### Backend Setup

Clone the repository:

```bash
git clone https://github.com/Sumiya0311/task-manager.git
cd task-manager/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a MySQL database and configure the backend environment variables.

Example `backend/.env`:

```env
SECRET_KEY=replace-with-your-own-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_ENGINE=mysql
DB_NAME=task_manager_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306

FRONTEND_URL=http://localhost:5173
```

Use your actual MySQL database name and credentials.

Run database migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver
```

Backend development URL:

http://127.0.0.1:8000

### Frontend Setup

Open another terminal:

```bash
cd task-manager/frontend
npm install
```

Configure the frontend API base URL to point to your local Django backend, using the environment variable expected by your Axios configuration.

Start the frontend:

```bash
npm run dev
```

Frontend development URL:

http://localhost:5173

## Main API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/auth/change-password/` | Change password |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks/` | List tasks |
| POST | `/api/tasks/` | Create task |
| GET | `/api/tasks/{id}/` | Get task details |
| PATCH | `/api/tasks/{id}/` | Update task |
| DELETE | `/api/tasks/{id}/` | Delete task |
| PATCH | `/api/tasks/{id}/toggle-complete/` | Toggle task completion |
| GET | `/api/tasks/dashboard/` | Get dashboard statistics |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories/` | List categories |
| POST | `/api/categories/` | Create category |
| PATCH | `/api/categories/{id}/` | Update category |
| DELETE | `/api/categories/{id}/` | Delete category |

Protected API endpoints require a valid JWT access token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Testing

The application has been manually tested using the deployed frontend and backend API.

### Authentication Tests
- User registration successful
- User login successful
- Protected API access verified
- User profile information displayed
- Password change successful
- Login with updated password successful

### Task Management Tests
- Create task successful
- View tasks successful
- Edit task successful
- Delete task successful
- Toggle task completion successful
- Task filtering tested
- Dashboard statistics displayed

### Category Management Tests
- Create category successful
- View categories successful
- Update category successful
- Delete category successful

### Deployment Tests
- Frontend deployed on Vercel
- Backend deployed on Render
- PostgreSQL connected in production
- Frontend and backend integration verified
- Production registration and login successful

## Screenshots

Application screenshots and API testing evidence are available in the [screenshots](screenshots/) directory.

Screenshots include application pages and tested functionality.

## Deployment Architecture

```text
User Browser
     |
     v
React Frontend
(Vercel)
     |
     | HTTPS API Requests
     v
Django REST Framework
(Render)
     |
     v
PostgreSQL Database
(Production)
```

### Frontend Deployment

The React application is deployed on Vercel.

Live URL:

https://task-manager-eta-ashy-35.vercel.app/

### Backend Deployment

The Django REST Framework application is deployed on Render using Gunicorn.

Live URL:

https://task-manager-wkhw.onrender.com/

The production backend uses PostgreSQL, while local development uses MySQL.

## Security

- JWT-based authentication
- Protected API endpoints
- User-specific task and category access
- Django password hashing
- Password validation
- Environment-based configuration
- CORS configuration
- HTTPS deployment

Sensitive credentials and environment files should never be committed to GitHub.

## Future Improvements

- Task reminders and notifications
- Recurring tasks
- Drag-and-drop task organization
- Team collaboration
- Automated testing and CI/CD

## Repository

https://github.com/Sumiya0311/task-manager

## Author

**Shaik Sumiya**

Python Developer | Full-Stack Development

## Project Status

**Deployed — Core functionality tested successfully.**

The application is accessible through the live frontend and connected to the deployed backend.