"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeMode = "dark" | "light";
export type ThemeColor = "violet" | "blue" | "emerald" | "orange" | "rose";
export type FontSize = "small" | "medium" | "large";

const THEME_STORAGE_KEY = "user-settings-v2";

const THEME_COLOR_HEX: Record<ThemeColor, string> = {
  violet: "#8b5cf6",
  blue: "#3b82f6",
  emerald: "#10b981",
  orange: "#f97316",
  rose: "#f43f5e",
};

const FONT_SIZE_PX: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readStoredTheme(): {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  fontSize: FontSize;
} {
  if (typeof window === "undefined")
    return { themeMode: "dark", themeColor: "violet", fontSize: "medium" };
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        themeMode: s.themeMode ?? "dark",
        themeColor: s.themeColor ?? "violet",
        fontSize: s.fontSize ?? "medium",
      };
    }
  } catch {
    // corrupt data
  }
  return { themeMode: "dark", themeColor: "violet", fontSize: "medium" };
}

function applyThemeToDOM(mode: ThemeMode, color: ThemeColor, size: FontSize) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "light") root.classList.remove("dark");
  else root.classList.add("dark");
  root.style.setProperty("--theme-accent", THEME_COLOR_HEX[color]);
  root.style.fontSize = FONT_SIZE_PX[size];
}

function writeThemeToStorage(mode: ThemeMode, color: ThemeColor, size: FontSize) {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ ...existing, themeMode: mode, themeColor: color, fontSize: size }),
    );
  } catch {
    // storage full or blocked
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  fontSize: FontSize;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
  setFontSize: (size: FontSize) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial state is read from localStorage (which the blocking script also
  // read before React hydrated, preventing flash of wrong theme).
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [themeColor, setThemeColorState] = useState<ThemeColor>("violet");
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [mounted, setMounted] = useState(false);

  // Read stored values once on mount
  useEffect(() => {
    const stored = readStoredTheme();
    setThemeModeState(stored.themeMode);
    setThemeColorState(stored.themeColor);
    setFontSizeState(stored.fontSize);
    applyThemeToDOM(stored.themeMode, stored.themeColor, stored.fontSize);
    setMounted(true);
  }, []);

  // ── Setters that apply to DOM + persist immediately ──

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    setThemeColorState((c) => {
      setFontSizeState((f) => {
        applyThemeToDOM(mode, c, f);
        writeThemeToStorage(mode, c, f);
        return f;
      });
      return c;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    // Read current state from DOM to avoid stale closure issues
    const isCurrentlyDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    setThemeMode(isCurrentlyDark ? "light" : "dark");
  }, [setThemeMode]);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    setThemeModeState((m) => {
      setFontSizeState((f) => {
        applyThemeToDOM(m, color, f);
        writeThemeToStorage(m, color, f);
        return f;
      });
      return m;
    });
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    setThemeModeState((m) => {
      setThemeColorState((c) => {
        applyThemeToDOM(m, c, size);
        writeThemeToStorage(m, c, size);
        return c;
      });
      return m;
    });
  }, []);

  const value: ThemeContextValue = {
    themeMode,
    themeColor,
    fontSize,
    setThemeMode,
    toggleTheme,
    setThemeColor,
    setFontSize,
    isDark: themeMode === "dark",
  };

  // Before mount, render children without context to avoid hydration mismatch.
  // The blocking script in layout.tsx ensures the DOM is already correct.
  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for pages rendered before provider mounts (shouldn't happen in
    // normal flow, but provides safe defaults).
    return {
      themeMode: "dark" as ThemeMode,
      themeColor: "violet" as ThemeColor,
      fontSize: "medium" as FontSize,
      setThemeMode: () => {},
      toggleTheme: () => {},
      setThemeColor: () => {},
      setFontSize: () => {},
      isDark: true,
    };
  }
  return ctx;
}
