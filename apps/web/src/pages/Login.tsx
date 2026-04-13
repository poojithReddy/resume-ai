import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

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

    try {
      const result = await login({
        email,
        password,
      });

      localStorage.setItem("auth_token", result.user_id);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="space-y-6">
            <PageHeader
              title="Sign in"
              subtitle="Access your saved analyses and results."
            />

            <form className="space-y-4" onSubmit={onSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="underline">
                Create one
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}