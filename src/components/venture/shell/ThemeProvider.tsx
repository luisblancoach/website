"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { applyTheme, readStoredTheme, resolveTheme, routeDefaultTheme, storeTheme, type Theme } from "@/lib/theme";

type ThemeState = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void };

const ThemeContext = createContext<ThemeState | null>(null);

// The document attribute (set before paint by themeBootScript) is the source of truth.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerSnapshot = (): Theme => "light";

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();

  // Client-side navigation does not rerun the boot script. Apply the new route's
  // default before paint, but only while the visitor has not chosen a theme.
  useLayoutEffect(() => {
    if (readStoredTheme()) return;
    applyTheme(resolveTheme({ stored: null, pathname, systemPrefersDark: prefersDark() }));
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event: MediaQueryListEvent) => {
      if (readStoredTheme() || routeDefaultTheme(window.location.pathname)) return;
      applyTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    storeTheme(next);
  }, []);

  const toggleTheme = useCallback(() => setTheme(getSnapshot() === "dark" ? "light" : "dark"), [setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
