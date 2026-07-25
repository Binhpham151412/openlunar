import { storage } from "./storage";

export async function buildBackup() {
  const [settings, favorites, notes] = await Promise.all([
    storage.get("settings"),
    storage.get("favorites"),
    storage.get("notes"),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: settings.value ? JSON.parse(settings.value) : null,
    favorites: favorites.value ? JSON.parse(favorites.value) : {},
    notes: notes.value ? JSON.parse(notes.value) : {},
  };
}

export function downloadBackup(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xemngay-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
