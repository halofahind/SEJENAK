import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import id from "./id/Translation.json";
import en from "./en/Translation.json";
const LANGUAGE_PREFERENCE_KEY = "user-language";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (savedLanguage) {
      callback(savedLanguage);
    } else {
      callback("id"); // default
    }
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    compatibilityJSON: "v3",
    resources: {
      id: { translation: id },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
