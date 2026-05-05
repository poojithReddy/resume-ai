import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Demo from "@/pages/Demo";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";
import CreateAnalysis from "@/pages/CreateAnalysis";
import Profile from "@/pages/Profile";
import Error500 from "@/pages/Error500";

import AdminUsers from "@/pages/AdminUsers";
import AdminCreateUser from "@/pages/AdminCreateUser";
import CompareJobs from "@/pages/CompareJobs";
import AdminLogin from "@/pages/AdminLogin";

import PublicLayout from "@/layouts/PublicLayout";
import AppLayout from "@/layouts/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
        </Route>

        {/* User */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateAnalysis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/results/:jobId" element={<Results />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/create-user" element={<AdminCreateUser />} />
            <Route path="/admin/compare" element={<CompareJobs />} />
          </Route>
        </Route>

        {/* Error */}
        <Route path="/error" element={<Error500 />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}