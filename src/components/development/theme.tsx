"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Sun, Moon } from "lucide-react";
type Theme = "dark" | "light";
const key = "testbuddy-hub-theme";
let fallback: Theme = "dark";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("testbuddy-theme", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("testbuddy-theme", callback);
  };
}
function snapshot(): Theme {
  try {
    return localStorage.getItem(key) === "light" ? "light" : "dark";
  } catch {
    return fallback;
  }
}
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});
export function HubTheme({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "dark" as Theme,
  );
  function toggle() {
    fallback = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(key, fallback);
    } catch {
      /* Keep theme switching available without persistent storage. */
    }
    window.dispatchEvent(new Event("testbuddy-theme"));
  }
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className="hub" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      type="button"
      className="hub-theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
