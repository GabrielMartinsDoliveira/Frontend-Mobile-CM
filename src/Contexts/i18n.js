// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      settingsScreenTitle: "Settings Screen",
      darkMode: "Dark Mode",
      notifications: "Notifications",
      fontSize: "Font Size",
      language: "Language",
      portuguese: "Portuguese",
      english: "English",
      toggle: "Toggle",
    },
  },
  pt: {
    translation: {
      settingsScreenTitle: "Tela de Configurações",
      darkMode: "Modo Escuro",
      notifications: "Notificações",
      fontSize: "Tamanho da Fonte",
      language: "Idioma",
      portuguese: "Português",
      english: "Inglês",
      toggle: "Alternar",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt', // idioma padrão
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;