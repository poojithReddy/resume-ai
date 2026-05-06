import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-brand px-4">

      <div className="w-full max-w-md">

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 md:p-8 space-y-6">

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/HireLensAILogo.png"
              alt="HireLens AI"
              className="h-10 mb-2"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600">
              Access your hiring insights and candidate analysis
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={onSubmit}>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />

              <div className="text-right">
                <Link
                  to="#"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {/* Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium shadow-md hover:bg-black hover:shadow-lg transition"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

          </form>

          {/* Footer */}
          <div className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
            >
              Create one
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}