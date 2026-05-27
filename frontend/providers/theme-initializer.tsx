"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { THEME_MODE_KEY, getTimeBasedTheme } from "@/lib/theme";

export function ThemeInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const mode = localStorage.getItem(THEME_MODE_KEY);
    if (!mode) {
      localStorage.setItem(THEME_MODE_KEY, "auto");
      setTheme(getTimeBasedTheme());
    } else if (mode === "auto") {
      setTheme(getTimeBasedTheme());
    }
  }, [setTheme]);

  return null;
}
