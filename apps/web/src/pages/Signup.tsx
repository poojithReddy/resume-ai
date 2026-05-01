import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { signup } from "@/lib/auth";

const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include 1 uppercase letter and 1 symbol.";

function isValidPassword(value: string) {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
}

export default function Signup() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (!isValidPassword(password)) {
      setError(PASSWORD_RULE_MESSAGE);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup({
        name,
        email,
        password,
      });

      localStorage.setItem("auth_token", result.token);

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account");
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
              title="Create account"
              subtitle="Set up an account to save jobs and screening results."
            />

            <form className="space-y-4" onSubmit={onSubmit}>
              <TextField
                label="Full name"
                name="name"
                placeholder="Your name"
                required
              />

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
                placeholder="Create a password"
                helperText={PASSWORD_RULE_MESSAGE}
                required
              />

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <Button
                variant="primary"
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create account"}
              </Button>
            </form>

            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}