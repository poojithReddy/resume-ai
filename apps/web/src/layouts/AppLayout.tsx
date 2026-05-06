import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { clearToken } from "@/lib/authUtil";

import {
  FiHome,
  FiPlusCircle,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 tablet:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* DESKTOP SIDEBAR (tablet and above) */}
      <aside
        className={`
          hidden tablet:flex fixed top-0 left-0 h-screen z-50
          ${collapsed ? "tablet:w-20" : "tablet:w-64"}
          bg-gradient-to-b from-primary to-secondary text-white
          flex-col p-4 transition-all duration-300
        `}
      >
        <SidebarContent
          collapsed={collapsed}
          isActive={isActive}
          handleLogout={handleLogout}
        />
      </aside>

      {/* MOBILE TOP MENU */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 tablet:hidden
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          bg-gradient-to-b from-primary to-secondary text-white shadow-lg p-4
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">
            HireLens AI
          </span>

          <button onClick={() => setMenuOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <SidebarContent
          collapsed={false}
          isActive={isActive}
          handleLogout={handleLogout}
          closeMobile={() => setMenuOpen(false)}
        />
      </div>

      {/* MAIN */}
      <div
        className={`
          flex flex-col transition-all duration-300
          ${collapsed ? "tablet:ml-20" : "tablet:ml-64"}
        `}
      >

        {/* HEADER */}
        <header className="border-b px-4 tablet:px-6 py-3 flex justify-between items-center bg-card">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU BUTTON */}
            <button
              className="tablet:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <FiMenu size={20} />
            </button>

            {/* DESKTOP COLLAPSE */}
            <button
              className="hidden tablet:block"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FiMenu size={18} />
            </button>

            <span className="text-sm text-text-secondary">
              Welcome back
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <div className="hidden tablet:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-xs">
              <span className="text-text-secondary">
                Account status:
              </span>
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              U
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 tablet:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* SIDEBAR CONTENT */
function SidebarContent({
  collapsed,
  isActive,
  handleLogout,
  closeMobile,
}: any) {
  return (
    <>
      {!collapsed && (
        <Link to="/dashboard" className="mb-6 flex items-center gap-2">
          <div className="bg-white rounded px-2 py-1 flex items-center gap-2">
            <img src="/favicon-32x32.png" className="h-5 w-5" />
            <span className="text-primary text-sm font-semibold">
              HireLens AI
            </span>
          </div>
        </Link>
      )}

      <nav className="flex flex-col gap-2 text-sm">

        <NavItem to="/dashboard" icon={<FiHome />} label="Dashboard" active={isActive("/dashboard")} collapsed={collapsed} onClick={closeMobile} />

        <NavItem to="/create" icon={<FiPlusCircle />} label="New Analysis" active={isActive("/create")} collapsed={collapsed} onClick={closeMobile} />

        <NavItem to="/profile" icon={<FiUser />} label="Profile" active={isActive("/profile")} collapsed={collapsed} onClick={closeMobile} />

        <NavItem to="/settings" icon={<FiSettings />} label="Settings" active={isActive("/settings")} collapsed={collapsed} onClick={closeMobile} />
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-200 hover:bg-red-500/20 rounded"
        >
          <FiLogOut />
          {!collapsed && "Logout"}
        </button>
      </div>
    </>
  );
}

/* NAV ITEM */
function NavItem({ to, icon, label, active, collapsed, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
        active ? "bg-white/20" : "hover:bg-white/10"
      }`}
    >
      {icon}
      {!collapsed && label}
    </Link>
  );
}