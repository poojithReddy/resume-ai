export type AppSettings = {
  displayName: string;
  email: string;
  demoMode: boolean;
  defaultView: "table" | "cards";
  minScore: number; // 0-100
};

const KEY = "resume_ai_settings_v1";

export const defaultSettings: AppSettings = {
  displayName: "Demo User",
  email: "demo@example.com",
  demoMode: true,
  defaultView: "table",
  minScore: 0,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}

export function clearSettings() {
  localStorage.removeItem(KEY);
}
