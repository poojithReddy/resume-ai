import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { login } from "@/lib/auth";
import { getUserRole } from "@/lib/authUtil";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email, password });

      const role = getUserRole();

      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        setError("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      navigate("/admin/users");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="space-y-6">
            <PageHeader
              title="Admin Login"
              subtitle="Restricted access for administrators"
            />

            <form className="space-y-4" onSubmit={handleLogin}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}