import { Link, useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

export default function Signup() {
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Mock signup (replace with backend later)
    localStorage.setItem("auth_token", "demo-token");
    navigate("/dashboard");
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
                autoComplete="name"
                required
              />

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
                placeholder="Create a password"
                autoComplete="new-password"
                required
                helperText="Use at least 8 characters."
              />

              <Button variant="primary" fullWidth type="submit">
                Create account
              </Button>

              <div className="text-sm text-gray-600">
                By creating an account, you agree to keep candidate data confidential.
              </div>
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
