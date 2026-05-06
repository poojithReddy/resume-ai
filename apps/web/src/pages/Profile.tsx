import { useEffect, useState } from "react";
import { Card, PageHeader, Button } from "@resume-ai/ui";

import { apiClient } from "@/lib/apiClient";
import { getUserFromToken } from "@/lib/authUtil";

import toast from "react-hot-toast";

/* ---------------- HELPERS ---------------- */

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

function getStrength(password: string) {
  const checks = getPasswordChecks(password);
  const score = Object.values(checks).filter(Boolean).length;

  if (!password) return { label: "", color: "", width: "0%" };

  if (score === 1) return { label: "Weak", color: "bg-red-500", width: "33%" };
  if (score === 2) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
  if (score === 3) return { label: "Strong", color: "bg-green-500", width: "100%" };

  return { label: "", color: "", width: "0%" };
}


export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    password: false,
    confirm: false,
  });

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const checks = getPasswordChecks(password);
  const strength = getStrength(password);

  const isPasswordMismatch =
    touched.confirm && password !== confirmPassword;

  const isFormValid =
    (!password || strength.label === "Strong") &&
    password === confirmPassword;

  const hasChanges = name || password;

  async function handleSave() {
    setLoading(true);

    try {
      await apiClient.post("/auth/update-profile", {
        name: name || undefined,
        password: password || undefined,
        confirm_password: confirmPassword || undefined,
      });

      toast.success("Profile updated successfully");

      setPassword("");
      setConfirmPassword("");
      setTouched({ password: false, confirm: false });

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 tablet:p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        <PageHeader
          title="Profile"
          subtitle="Update your details and keep your account secure"
        />

        <Card padding="lg">
          <div className="space-y-5">

            {/* NAME */}
            <InputField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Your full name"
            />

            {/* EMAIL */}
            <InputField
              label="Email"
              value={email}
              disabled
            />

            {/* PASSWORD */}
            <div className="space-y-3">
              <InputField
                label="New Password"
                value={password}
                onChange={setPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank if not changing"
                onBlur={() =>
                  setTouched((t) => ({ ...t, password: true }))
                }
                rightAction={
                  <ToggleButton
                    onClick={() => setShowPassword(!showPassword)}
                    label={showPassword ? "Hide" : "Show"}
                  />
                }
              />

              {/* STRENGTH */}
              {password && (
                <>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 ${strength.color} transition-all`}
                      style={{ width: strength.width }}
                    />
                  </div>

                  <div className="text-xs text-text-secondary">
                    Strength: <span className="font-medium">{strength.label}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <CheckItem valid={checks.length} text="At least 8 characters" />
                    <CheckItem valid={checks.uppercase} text="One uppercase letter" />
                    <CheckItem valid={checks.symbol} text="One symbol" />
                  </div>
                </>
              )}
            </div>

            {/* CONFIRM */}
            <div className="space-y-2">
              <InputField
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type={showConfirm ? "text" : "password"}
                onBlur={() =>
                  setTouched((t) => ({ ...t, confirm: true }))
                }
                rightAction={
                  <ToggleButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    label={showConfirm ? "Hide" : "Show"}
                  />
                }
              />

              {isPasswordMismatch && (
                <div className="text-red-600 text-xs">
                  Passwords do not match
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">

              <button
                onClick={handleSave}
                disabled={loading || !isFormValid || !hasChanges}
                className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => window.history.back()}
                className="px-4 py-2.5 rounded-lg border text-sm hover:bg-gray-100 transition"
              >
                Back
              </button>

            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}


function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  onBlur,
  rightAction,
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-text-primary">
        {label}
      </label>

      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary pr-14 disabled:bg-gray-100"
        />

        {rightAction && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
}


function ToggleButton({ onClick, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-text-secondary hover:underline"
    >
      {label}
    </button>
  );
}

function CheckItem({ valid, text }: any) {
  return (
    <div className={`flex items-center gap-2 ${valid ? "text-green-600" : "text-gray-400"}`}>
      <span>{valid ? "✔" : "•"}</span>
      <span>{text}</span>
    </div>
  );
}