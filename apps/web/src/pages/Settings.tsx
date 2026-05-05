import { useMemo, useState } from "react";
import {
  clearSettings,
  defaultSettings,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "@/lib/settings";
import { clearToken } from "@/lib/authUtil";

export default function Settings() {
  const initial = useMemo(() => loadSettings(), []);
  const [settings, setSettings] = useState<AppSettings>(initial);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function update(patch: Partial<AppSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    setSavedAt(new Date().toLocaleTimeString());
  }

  function reset() {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    setSavedAt(new Date().toLocaleTimeString());
  }

  function clearAll() {
    clearSettings();
    setSettings(defaultSettings);
    setSavedAt(null);
    alert("Settings cleared.");
  }

  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">
          Preferences are stored locally on this device.
        </p>
        {savedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Saved at {savedAt}
          </p>
        )}
      </div>

      {/* Profile */}
      <section className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <div className="text-sm text-gray-600">
              Display name
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              value={settings.displayName}
              onChange={(e) =>
                update({ displayName: e.target.value })
              }
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">Email</div>
            <input
              className="w-full border rounded px-3 py-2"
              value={settings.email}
              onChange={(e) =>
                update({ email: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      {/* Preferences */}
      <section className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Preferences</h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Demo mode</div>
            <div className="text-sm text-gray-600">
              Uses mock data instead of backend APIs.
            </div>
          </div>

          <button
            className={`border rounded px-4 py-2 ${
              settings.demoMode ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() =>
              update({ demoMode: !settings.demoMode })
            }
          >
            {settings.demoMode ? "On" : "Off"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <div className="text-sm text-gray-600">
              Default results view
            </div>
            <select
              className="w-full border rounded px-3 py-2"
              value={settings.defaultView}
              onChange={(e) =>
                update({
                  defaultView:
                    e.target.value as AppSettings["defaultView"],
                })
              }
            >
              <option value="table">Table</option>
              <option value="cards">Cards</option>
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">
              Minimum score:{" "}
              <span className="font-semibold">
                {settings.minScore}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.minScore}
              onChange={(e) =>
                update({ minScore: Number(e.target.value) })
              }
              className="w-full"
            />
          </label>
        </div>
      </section>

      {/* Actions */}
      <section className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Actions</h2>

        <div className="flex flex-wrap gap-3">
          <button
            className="border rounded px-4 py-2"
            onClick={reset}
          >
            Reset to defaults
          </button>

          <button
            className="border rounded px-4 py-2"
            onClick={clearAll}
          >
            Clear settings
          </button>

          <button
            className="border rounded px-4 py-2 bg-red-500 text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Later, when backend is added, these can be saved per user
          account.
        </p>
      </section>
    </div>
  );
}