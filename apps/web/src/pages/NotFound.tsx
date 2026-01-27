import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg w-full border rounded-lg p-6 bg-white space-y-4">
        <div className="text-sm text-gray-500">404</div>
        <h1 className="text-2xl font-bold">Page not found</h1>

        <p className="text-gray-600">
          No page exists at:{" "}
          <span className="font-mono text-sm">{location.pathname}</span>
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded border px-4 py-2 bg-gray-900 text-white"
          >
            Go to Home
          </Link>

          <Link
            to="/demo"
            className="inline-flex items-center justify-center rounded border px-4 py-2"
          >
            Try Demo
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded border px-4 py-2"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
