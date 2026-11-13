import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Wait until authentication is checked
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Shared layout for authenticated pages
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}