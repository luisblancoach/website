// Audience determines content; the visitor determines appearance.
// Only an explicit choice from the theme switch is stored. Route defaults and
// the system preference apply when no stored choice exists and are never saved.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "raidguild-theme";

export function parseTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function routeDefaultTheme(pathname: string): Theme | null {
  if (pathname === "/clients" || pathname.startsWith("/clients/")) return "light";
  if (pathname === "/community" || pathname.startsWith("/community/")) return "dark";
  return null;
}

export function resolveTheme({ stored, pathname, systemPrefersDark }: {
  stored: unknown;
  pathname: string;
  systemPrefersDark: boolean;
}): Theme {
  return parseTheme(stored) ?? routeDefaultTheme(pathname) ?? (systemPrefersDark ? "dark" : "light");
}

// Runs before first paint (inlined in the root layout) so the initial render never
// shows the wrong theme. Keep it in step with resolveTheme; tests/theme.test.mjs
// checks both against the same cases.
export const themeBootScript = `(function(){var d=document.documentElement,t=null;try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==="light"||s==="dark")t=s}catch(e){}if(!t){var p=location.pathname;if(p==="/clients"||p.indexOf("/clients/")===0)t="light";else if(p==="/community"||p.indexOf("/community/")===0)t="dark";else{try{t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){t="light"}}}d.dataset.theme=t;d.style.colorScheme=t})();`;

export function readStoredTheme(): Theme | null {
  try {
    return parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The choice still applies for this page view without storage.
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme !== theme) root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
