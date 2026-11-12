import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "./pages/categories";
import Profile from "./pages/Profile";

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />

        <Route
          path="/tasks/new"
          element={<TaskForm />}
        />

        <Route
          path="/tasks/:id/edit"
          element={<TaskForm />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* Profile route */}
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      {/* Invalid routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}