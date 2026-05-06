import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/lib/auth";
import { getUserRole } from "@/lib/authUtil";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  function validate() {
    const newErrors: any = {};

    if (!email) newErrors.email = "Required";
    if (!password) newErrors.password = "Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await login({ email, password });

      const role = getUserRole();

      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        setErrors({
          general: "You don’t have permission to access admin panel",
        });
        setLoading(false);
        return;
      }

      navigate("/admin/users");
    } catch (err) {
      setErrors({
        general:
          err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = email && password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">

      <div className="w-full max-w-md">

        <div className="bg-card rounded-xl shadow-card p-6 md:p-8 space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold">
              Admin Access
            </h1>
            <p className="text-sm text-text-secondary">
              Sign in to manage users and system settings
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              placeholder="admin@company.com"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              placeholder="Enter password"
            />

            {/* GENERAL ERROR */}
            {errors.general && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errors.general}
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

/* INPUT */
function InputField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary"
      />

      {error && (
        <div className="text-red-600 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}