import { Navigate, Outlet } from "react-router-dom";
import { getToken, isTokenExpired, clearToken } from "@/lib/authUtil";

export default function ProtectedRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired()) {
    clearToken();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}