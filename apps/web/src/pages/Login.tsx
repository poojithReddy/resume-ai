import { Link, useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

export default function Login() {
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Mock auth (replace with backend later)
    localStorage.setItem("auth_token", "demo-token");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="space-y-6">
            <PageHeader
              title="Sign in"
              subtitle="Access your dashboard and saved screening runs."
            />

            <form className="space-y-4" onSubmit={onSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <Button variant="primary" fullWidth type="submit">
                Sign in
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/demo" className="underline">
                  Try demo
                </Link>

                <button
                  type="button"
                  className="underline"
                  onClick={() => alert("Password reset will be added later")}
                >
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
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
