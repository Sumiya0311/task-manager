import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <NavLink to="/dashboard">Task Manager</NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>

      <button type="button" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}