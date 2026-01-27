import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-lg cursor-pointer" onClick={() => navigate("/dashboard")}>
            Resume AI
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <button
              className="underline"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="underline"
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>

            <button
              className="underline text-red-600"
              onClick={logout}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
