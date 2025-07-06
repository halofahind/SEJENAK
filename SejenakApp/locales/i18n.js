import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import id from "./locales/id/translation.json";
import en from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: Localization.locale.includes("id") ? "id" : "en",
  fallbackLng: "en",
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
