import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import AppRouter from "@/routes/AppRouter";
import { Toaster } from "react-hot-toast";

import "@resume-ai/ui/styles";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </HelmetProvider>
  </React.StrictMode>
);