import { useState } from "react";
import { Button, Card, PageHeader, TextField } from "@resume-ai/ui";

import { apiClient } from "@/lib/apiClient";

const ROLE_OPTIONS = ["USER", "ADMIN", "SUPER_ADMIN"];

export default function AdminCreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!name || !email || !password) {
      setError("All fields are required");
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiClient.post("/admin/users", {
        name,
        email,
        password,
        role,
      });

      setMessage("User created successfully");

      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">
        <PageHeader
          title="Create User"
          subtitle="Admin can create new users"
        />

        <Card padding="lg">
          <div className="space-y-4">
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}

            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}