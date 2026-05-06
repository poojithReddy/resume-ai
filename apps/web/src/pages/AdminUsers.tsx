import { useEffect, useState } from "react";
import { Button, Card, PageHeader } from "@resume-ai/ui";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

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
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function deactivateUser(userId: string) {
    const confirm = window.confirm("Deactivate this user?");
    if (!confirm) return;

    try {
      await apiClient.post(`/admin/users/${userId}/deactivate`);
      toast.success("User deactivated");
      loadUsers();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to deactivate user"
      );
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function getRoleBadge(role: string) {
    if (role === "SUPER_ADMIN")
      return "bg-purple-100 text-purple-700";
    if (role === "ADMIN")
      return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">

      <PageHeader
        title="User Management"
        subtitle="Manage platform users and access levels"
      />

      {/* STATES */}
      {loading && (
        <div className="text-sm text-text-secondary">
          Loading users...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <Card padding="md">
          <div className="text-center text-sm text-text-secondary py-6">
            No users found.
          </div>
        </Card>
      )}

      {/* MOBILE CARDS */}
      <div className="tablet:hidden space-y-3">
        {users.map((user) => (
          <Card key={user.id} padding="md">

            <div className="space-y-2">

              <div className="font-semibold">
                {user.name}
              </div>

              <div className="text-sm text-text-secondary">
                {user.email}
              </div>

              <div className="flex items-center gap-2 text-xs">

                <span
                  className={`px-2 py-1 rounded-full ${getRoleBadge(user.role)}`}
                >
                  {user.role}
                </span>

                <span
                  className={`px-2 py-1 rounded-full ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>

              </div>

              {user.is_active && (
                <button
                  onClick={() => deactivateUser(user.id)}
                  className="w-full mt-2 border rounded-md py-2 text-sm hover:bg-gray-100"
                >
                  Deactivate
                </button>
              )}

            </div>

          </Card>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden tablet:block">
        <Card padding="md">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-muted text-left">
                <tr className="text-text-secondary">
                  <th className="p-3 text-center">Name</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">Role</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t text-center hover:bg-muted/40"
                  >
                    <td className="p-3 font-medium">
                      {user.name}
                    </td>

                    <td className="p-3 text-text-secondary">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3">
                      {user.is_active ? (
                        <Button
                          variant="secondary"
                          onClick={() => deactivateUser(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </Card>
      </div>

    </div>
  );
}