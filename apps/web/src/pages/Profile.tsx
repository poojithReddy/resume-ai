import { useState } from "react";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { apiClient } from "@/lib/apiClient";

const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include 1 uppercase letter and 1 symbol.";

function isValidPassword(value: string) {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
}

export default function Profile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setMessage(null);

    // password match check
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // password rule validation
    if (password && !isValidPassword(password)) {
      setError(PASSWORD_RULE_MESSAGE);
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/auth/update-profile", {
        name: name || undefined,
        password: password || undefined,
        confirm_password: confirmPassword || undefined,
      });

      setMessage("Profile updated successfully");

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Update your personal details and password"
        />

        <Card padding="lg">
          <div className="space-y-4">
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

            <TextField
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <TextField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}

            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}