import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@resume-ai/ui";
import { clearToken } from "@/lib/authUtil";

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/admin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <Link to="/admin/users" className="font-semibold text-lg">
          Resume AI Admin
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/admin/users">
            <Button variant="ghost">Users</Button>
          </Link>

          <Link to="/admin/create-user">
            <Button variant="secondary">Create User</Button>
          </Link>

          <Link to="/admin/compare">
            <Button variant="ghost">Compare</Button>
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