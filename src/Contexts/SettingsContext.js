import React, { createContext, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
// Importa o React e useState para gerenciar o estado
// Cria o contexto
export const SettingsContext = createContext();

// Provider global
export const SettingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("pt");

  // Tema dinâmico modo escuro
  const theme = {
    dark: isDarkMode,
    colors: {
      primary: "#6200ee",
      background: isDarkMode ? "#121212" : "#ffffff",
      text: isDarkMode ? "#ffffff" : "#000000",
    },
  };

  return (
    <SettingsContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        notifications,
        setNotifications,
        fontSize,
        setFontSize,
        language,
        setLanguage,
        theme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
// Exporta o contexto para uso em outros componentes