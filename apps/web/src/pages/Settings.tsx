import { useMemo, useState } from "react";
import {
  clearSettings,
  defaultSettings,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "@/lib/settings";
import { clearToken } from "@/lib/authUtil";
import { Card, PageHeader, Button } from "@resume-ai/ui";
import toast from "react-hot-toast";

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
    toast.success("Settings reset");
  }

  function clearAll() {
    clearSettings();
    setSettings(defaultSettings);
    setSavedAt(null);
    toast.success("Settings cleared");
  }

  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">

      <PageHeader
        title="Settings"
        subtitle="Manage your preferences and local settings"
      />

      {savedAt && (
        <div className="text-xs text-text-secondary">
          Last saved at {savedAt}
        </div>
      )}

      {/* PROFILE */}
      <Card padding="lg">
        <div className="space-y-5">
          <div className="font-semibold text-base">Profile</div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">

            <InputField
              label="Display name"
              value={settings.displayName}
              onChange={(v) => update({ displayName: v })}
            />

            <InputField
              label="Email"
              value={settings.email}
              onChange={(v) => update({ email: v })}
            />

          </div>
        </div>
      </Card>

      {/* PREFERENCES */}
      <Card padding="lg">
        <div className="space-y-5">

          <div className="font-semibold text-base">
            Preferences
          </div>

          {/* DEMO MODE */}
          <div className="flex items-center justify-between gap-4 flex-wrap">

            <div>
              <div className="font-medium text-sm">
                Demo mode
              </div>
              <div className="text-xs text-text-secondary">
                Use sample data instead of backend APIs
              </div>
            </div>

            <button
              onClick={() =>
                update({ demoMode: !settings.demoMode })
              }
              className={`px-4 py-2 rounded-full text-sm transition ${
                settings.demoMode
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {settings.demoMode ? "On" : "Off"}
            </button>

          </div>

          {/* VIEW + SLIDER */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Default results view
              </label>

              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
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
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Minimum score:{" "}
                <span className="font-semibold">
                  {settings.minScore}
                </span>
              </label>

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
            </div>

          </div>

        </div>
      </Card>

      {/* ACTIONS */}
      <Card padding="lg">
        <div className="space-y-5">

          <div className="font-semibold text-base">
            Actions
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <Button variant="secondary" onClick={reset}>
              Reset to defaults
            </Button>

            <Button variant="ghost" onClick={clearAll}>
              Clear settings
            </Button>

            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

          <div className="text-xs text-text-secondary">
            These settings are stored locally on your device.
          </div>

        </div>
      </Card>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}