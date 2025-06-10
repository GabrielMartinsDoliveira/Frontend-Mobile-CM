import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Switch, RadioButton, Provider as PaperProvider } from "react-native-paper";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("pt");

  // Define o tema com base no modo escuro habilitado
  const theme = {
    dark: isDarkMode,
    colors: {
      primary: "#6200ee",
      background: isDarkMode ? "#121212" : "#ffffff",
      text: isDarkMode ? "#ffffff" : "#000000",
    },
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleNotifications = () => setNotifications((prev) => !prev);
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => (prev > 10 ? prev - 1 : prev));

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleLarge" style={{ color: theme.colors.text, fontSize }}>
          TELA DE CONFIGURAÇÕES
        </Text>

        {/* Modo Escuro */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Modo Escuro</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* Notificações */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Notificações</Text>
          <Switch value={notifications} onValueChange={toggleNotifications} />
        </View>

        {/* Tamanho da Fonte */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Tamanho da Fonte: {fontSize}
          </Text>
          <View style={styles.buttonGroup}>
            <Button mode="outlined" onPress={decreaseFontSize} style={styles.button}>
              A-
            </Button>
            <Button mode="outlined" onPress={increaseFontSize} style={styles.button}>
              A+
            </Button>
          </View>
        </View>

        {/* Seleção de Idioma */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Idioma</Text>
          <RadioButton.Group onValueChange={(value) => setLanguage(value)} value={language}>
            <View style={styles.radioItem}>
              <RadioButton value="pt" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }}>Português</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="en" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }}>English</Text>
            </View>
          </RadioButton.Group>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 4,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
});