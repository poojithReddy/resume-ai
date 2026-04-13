import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@resume-ai/ui";

export default function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-semibold text-lg">
          Resume AI
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/create">
            <Button variant="secondary">New Analysis</Button>
          </Link>

          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}