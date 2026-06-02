"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/**
 * Client-side Toaster that detects the current theme by reading the `.dark`
 * class on <html>.  Updates automatically when the user toggles theme.
 */
export function ThemeToaster() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const update = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    update();

    // Observe class changes on <html> to detect theme toggles
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
    />
  );
}
