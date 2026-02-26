import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';

export type PrimaryColor = 
  | '#0F766E'
  | '#4F46E5' 
  | '#1D4ED8';

interface Theme {
  primary: PrimaryColor;
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  tabInactive: string;
}

interface ThemeContextProps {
  theme: Theme;
  setPrimary: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [primary, setPrimary] =
    useState<PrimaryColor>('#0F766E');

  const theme = useMemo<Theme>(
    () => ({
      primary,
      background: '#F8FAFC',
      card: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      tabInactive: '#94A3B8',
    }),
    [primary]
  );

  const value = useMemo(
    () => ({
      theme,
      setPrimary,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  return context;
};