"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "next-themes";
import { useEffect } from "react";
import { THEME_MODE_KEY, THEME_STORAGE_KEY, getTimeBasedTheme } from "@/lib/theme";
import { ThemeInitializer } from "@/providers/theme-initializer";

function AutoThemeSync() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const mode =
      typeof window !== "undefined"
        ? (localStorage.getItem(THEME_MODE_KEY) as "auto" | "manual" | null)
        : null;

    if (mode !== "auto" && mode !== null) return;

    const applyTimeTheme = () => {
      const timeTheme = getTimeBasedTheme();
      if (theme !== timeTheme) {
        setTheme(timeTheme);
      }
    };

    applyTimeTheme();
    const interval = setInterval(applyTimeTheme, 60_000);
    return () => clearInterval(interval);
  }, [theme, setTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange={false}
    >
      <ThemeInitializer />
      <AutoThemeSync />
      {children}
    </NextThemesProvider>
  );
}
