import { useState } from "react";
import { Card, PageHeader } from "@resume-ai/ui";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

const ROLE_OPTIONS = ["USER", "ADMIN", "SUPER_ADMIN"];

export default function AdminCreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  function validate() {
    const newErrors: any = {};

    if (!name) newErrors.name = "Required";
    if (!email) newErrors.email = "Required";
    if (!password) newErrors.password = "Required";

    if (password && password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setErrors({});
  }

  async function handleCreate() {
    if (!validate()) return;

    setLoading(true);

    try {
      await apiClient.post("/admin/users", {
        name,
        email,
        password,
        role,
      });

      toast.success("User created successfully");

      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    name && email && password && password.length >= 8;

  return (
    <div className="p-4 tablet:p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        <PageHeader
          title="Create User"
          subtitle="Add a new user and assign role"
        />

        <Card padding="lg">

          <div className="space-y-6">

            {/* NAME */}
            <InputField
              label="Full Name"
              value={name}
              onChange={setName}
              error={errors.name}
            />

            {/* EMAIL */}
            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              error={errors.email}
            />

            {/* PASSWORD */}
            <InputField
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              error={errors.password}
            />

            {/* ROLE */}
            <SelectField
              label="Role"
              value={role}
              onChange={setRole}
              options={ROLE_OPTIONS}
            />

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">

              <button
                onClick={handleCreate}
                disabled={loading || !isFormValid}
                className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create User"}
              </button>

              <button
                onClick={resetForm}
                className="px-4 py-2.5 rounded-lg border text-sm hover:bg-gray-100 transition"
              >
                Reset
              </button>

            </div>

          </div>

        </Card>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function InputField({ label, value, onChange, error, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      />

      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}

/* ---------------- SELECT ---------------- */

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}