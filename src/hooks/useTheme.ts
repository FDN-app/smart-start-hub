import { useEffect, useState } from "react";
import { configStorage } from "@/services/storage/configStorage";

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">(() => configStorage.get().theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    configStorage.set({ theme });
  }, [theme]);

  return {
    theme,
    setTheme: setThemeState,
    toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
  };
}