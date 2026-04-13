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

import PublicLayout from "@/layouts/PublicLayout";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateAnalysis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/results/:jobId" element={<Results />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}