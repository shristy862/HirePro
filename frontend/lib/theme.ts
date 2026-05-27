export type ThemeMode = "light" | "dark" | "auto";

export const THEME_STORAGE_KEY = "hireflow-theme";
export const THEME_MODE_KEY = "hireflow-theme-mode";

export function getTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

export function resolveTheme(
  storedTheme: string | null,
  mode: ThemeMode | null
): "light" | "dark" {
  if (mode === "auto" || storedTheme === "auto" || !storedTheme) {
    return getTimeBasedTheme();
  }
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return getTimeBasedTheme();
}
