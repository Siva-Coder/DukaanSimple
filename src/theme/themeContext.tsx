import React, { createContext, useContext, useState, useMemo } from 'react';

export type PrimaryColor =
  | '#4F46E5'
  | '#1D4ED8'
  | '#0F766E';

interface ThemeContextProps {
  primary: PrimaryColor;
  setPrimary: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primary, setPrimary] = useState<PrimaryColor>('#4F46E5');

  const value = useMemo(() => ({ primary, setPrimary }), [primary]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};