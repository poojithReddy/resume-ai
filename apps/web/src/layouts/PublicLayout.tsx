import { Outlet, Link } from "react-router-dom";
import { Button } from "@resume-ai/ui";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-semibold text-lg">
          Resume AI
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}