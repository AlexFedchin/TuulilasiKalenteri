import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fi from "./locales/fi.json";
import ru from "./locales/ru.json";

// Get stored language or default to 'en'
const storedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
    ru: { translation: ru },
  },
  lng: storedLang,
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes content
  },
});

// Listen to language change and store it in localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
