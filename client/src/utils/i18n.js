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

// Update the document title and meta description based on the selected language
const updatePageMetadata = (lng) => {
  const titles = {
    en: "Calendar",
    fi: "Kalenteri",
    ru: "Календарь",
  };

  const descriptions = {
    en: "Calendar tool for the TuulilasiPojat franchise. Easy way to manage bookings and orders.",
    fi: "Kalenterityökalu TuulilasiPojat-franchisingille. Helppo tapa hallita varauksia ja tilauksia.",
    ru: "Инструмент календаря для франшизы TuulilasiPojat. Легкий способ управлять бронированиями и заказами.",
  };

  // Update the document title
  document.title = titles[lng] || titles["en"];

  // Update the meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      descriptions[lng] || descriptions["en"]
    );
  }
};

// Set the initial metadata
updatePageMetadata(storedLang);

// Listen to language change and store it in localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  updatePageMetadata(lng);
});

export default i18n;
