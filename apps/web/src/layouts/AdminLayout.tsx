import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { clearToken } from "@/lib/authUtil";

import {
  FiUsers,
  FiUserPlus,
  FiShuffle,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearToken();
    navigate("/admin");
  }

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 tablet:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR DESKTOP */}
      <aside
        className={`
          hidden tablet:flex fixed top-0 left-0 h-screen z-50
          ${collapsed ? "tablet:w-20" : "tablet:w-64"}
          bg-gray-900 text-white
          flex-col p-5 transition-all duration-300
        `}
      >
        <SidebarContent
          collapsed={collapsed}
          isActive={isActive}
          handleLogout={handleLogout}
        />
      </aside>

      {/* MOBILE MENU (TOP DROPDOWN) */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 tablet:hidden
          transform transition-transform duration-300
          ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          bg-gray-900 text-white shadow-lg p-5
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">
            Admin Panel
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

            {/* MOBILE MENU */}
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
              Admin Dashboard
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
              Admin Mode
            </span>

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

      {/* LOGO */}
      {!collapsed && (
        <Link
          to="/admin/users"
          onClick={closeMobile}
          className="mb-8 flex items-center gap-2"
        >
          <div className="bg-white rounded px-2 py-1 flex items-center gap-2">
            <img
              src="/favicon-32x32.png"
              className="h-5 w-5"
            />
            <span className="text-gray-900 text-sm font-semibold">
              Admin Panel
            </span>
          </div>
        </Link>
      )}

      {/* NAV */}
      <nav className="flex flex-col gap-2 text-sm">

        <NavItem
          to="/admin/users"
          icon={<FiUsers />}
          label="Users"
          active={isActive("/admin/users")}
          collapsed={collapsed}
          onClick={closeMobile}
        />

        <NavItem
          to="/admin/create-user"
          icon={<FiUserPlus />}
          label="Create User"
          active={isActive("/admin/create-user")}
          collapsed={collapsed}
          onClick={closeMobile}
        />

        <NavItem
          to="/admin/compare"
          icon={<FiShuffle />}
          label="Compare"
          active={isActive("/admin/compare")}
          collapsed={collapsed}
          onClick={closeMobile}
        />
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-300 hover:bg-red-500/20 rounded transition"
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
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md transition
        ${active ? "bg-white/20 font-medium" : "hover:bg-white/10"}
      `}
    >
      {icon}
      {!collapsed && label}
    </Link>
  );
}