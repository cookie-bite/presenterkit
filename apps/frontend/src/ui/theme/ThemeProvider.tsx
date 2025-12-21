'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { colors, Mode } from './colors';
import { GlobalStyles } from './global';
import { radius } from './radius';
import { text } from './text';

type ThemeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

type Props = { children: ReactNode };

const getSystemTheme = (): Mode => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<Mode>('dark'); // Start with 'dark' to avoid hydration mismatch

  useEffect(() => {
    const systemTheme = getSystemTheme();
    setMode(systemTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(
    () => ({
      colors: colors[mode],
      mode,
      radius,
      text,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
