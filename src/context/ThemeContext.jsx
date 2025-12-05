import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const THEMES = {
  light: {
    "--bg": "#f5f5f5",
    "--bg-card": "#ffffff",
    "--bg-sidebar": "#ffffff",
    "--border-subtle": "#e5e7eb",
    "--text-main": "#111827",
    "--text-muted": "#6b7280",
    "--accent": "#111827",
  },
  // потом добавим "greenNeon" или "dark"
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const current = THEMES[theme];
    Object.entries(current).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
