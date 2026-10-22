"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SHOWCASE_THEME,
  type ShowcaseTheme,
} from "@/components/visuals/showcase-screenshots";

interface ShowcaseThemeContextValue {
  theme: ShowcaseTheme;
  setTheme: (theme: ShowcaseTheme) => void;
}

const ShowcaseThemeContext = createContext<ShowcaseThemeContextValue | null>(null);

export function ShowcaseThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ShowcaseTheme>(DEFAULT_SHOWCASE_THEME);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ShowcaseThemeContext.Provider value={value}>{children}</ShowcaseThemeContext.Provider>;
}

export function useShowcaseTheme(): ShowcaseThemeContextValue {
  const context = useContext(ShowcaseThemeContext);
  if (!context) {
    throw new Error("useShowcaseTheme must be used within ShowcaseThemeProvider");
  }
  return context;
}
