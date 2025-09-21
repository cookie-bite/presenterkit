"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { GlobalStyles } from "./global";
import { colors, Mode } from "./colors";
import { radius } from "./radius";
import { text } from "./text";

type ThemeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

type Props = { children: ReactNode };

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<Mode>("dark");

  const theme = {
    colors: colors[mode],
    mode,
    radius,
    text,
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
