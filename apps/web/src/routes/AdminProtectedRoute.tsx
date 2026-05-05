import { Navigate, Outlet } from "react-router-dom";
import {
  getToken,
  getUserRole,
  isTokenExpired,
  clearToken,
} from "@/lib/authUtil";

export default function AdminProtectedRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  if (isTokenExpired()) {
    clearToken();
    return <Navigate to="/admin" replace />;
  }

  const role = getUserRole();

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}