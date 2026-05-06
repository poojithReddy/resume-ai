import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "@/lib/auth";

const PASSWORD_RULES = {
  length: {
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  uppercase: {
    label: "At least 1 uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  symbol: {
    label: "At least 1 symbol",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
};

export default function Signup() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const ruleResults = Object.values(PASSWORD_RULES).map((rule) =>
    rule.test(password)
  );

  const isPasswordValid = ruleResults.every(Boolean);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const pwd = String(form.get("password") ?? "");

    if (!name || !email || !pwd) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        name,
        email,
        password: pwd,
      });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-brand px-4">

      <div className="w-full max-w-md">

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 md:p-8 space-y-6">

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/HireLensAILogo.png"
              alt="HireLens AI"
              className="h-10 mb-2"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-600">
              Start analysing candidates and make better hiring decisions
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={onSubmit}>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                name="name"
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Password checklist */}
              <div className="text-xs space-y-1 mt-2">
                {Object.values(PASSWORD_RULES).map((rule, index) => {
                  const passed = rule.test(password);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        passed ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      <span>
                        {passed ? "✔" : "✖"}
                      </span>
                      <span>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium shadow-md hover:bg-black transition"
            >
              {isLoading ? "Creating..." : "Create account"}
            </button>

          </form>

          {/* Footer */}
          <div className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}