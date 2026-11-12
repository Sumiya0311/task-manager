# Task Manager — Django REST Framework & React

A full-stack Task Manager application inspired by Todoist. Users can securely manage tasks, organize categories, track progress, and filter tasks through a responsive web interface.

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT authentication
- MySQL
- django-filter
- django-cors-headers

### Frontend
- React.js
- Vite
- JavaScript
- React Router
- Axios
- CSS

## Features

### Authentication
- User registration and login
- JWT access and refresh tokens
- Protected routes
- User profile
- Change password
- Logout

### Task Management
- Create, view, edit, and delete tasks
- Mark tasks as complete or incomplete
- Task priority: Low, Medium, High
- Task status: To Do, In Progress, Done
- Due date management
- Search, filtering, sorting, and pagination

### Category Management
- Create categories
- View categories
- Update and delete categories
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
│   └── package.json
├── screenshots/
├── .gitignore
└── README.md
```

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your MySQL database and environment variables.

Run migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Configure the frontend API base URL to point to the Django backend.

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register user |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Current user |
| POST | `/api/auth/change-password/` | Change password |
| GET, POST | `/api/tasks/` | List/create tasks |
| GET, PATCH, DELETE | `/api/tasks/{id}/` | Manage task |
| PATCH | `/api/tasks/{id}/toggle-complete/` | Toggle completion |
| GET | `/api/tasks/dashboard/` | Dashboard statistics |
| GET, POST | `/api/categories/` | List/create categories |
| PATCH, DELETE | `/api/categories/{id}/` | Update/delete category |

Protected endpoints require JWT authentication.

## Screenshots

Application and API testing screenshots are available in the [screenshots](screenshots/) directory.

## Deployment

- **Frontend:** Vercel — Pending
- **Backend:** Render — Pending

Live deployment URLs will be added after deployment.

## Repository

https://github.com/Sumiya0311/task-manager

## Author

Shaik Sumiya

Python Developer | Full-Stack Development