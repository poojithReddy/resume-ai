import { useEffect, useState } from "react";
import { Button, Card, PageHeader } from "@resume-ai/ui";

import { apiClient } from "@/lib/apiClient";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      const data = await apiClient.get("/admin/users");
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function deactivateUser(userId: string) {
    try {
      await apiClient.post(`/admin/users/${userId}/deactivate`);
      loadUsers();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to deactivate user");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage platform users"
      />

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} padding="md">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {user.email}
                </div>
                <div className="text-sm">
                  Role: {user.role}
                </div>
                <div className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      user.is_active
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {user.is_active && (
                <Button
                  variant="secondary"
                  onClick={() => deactivateUser(user.id)}
                >
                  Deactivate
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}