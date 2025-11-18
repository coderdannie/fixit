import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON files
import en from "../locales/en.json";
import ha from "../locales/ha.json";
import ig from "../locales/ig.json";
import pcm from "../locales/pcm.json";
import yo from "../locales/yo.json";

const LANGUAGE_KEY = "@app_language";

const resources = {
  en: { translation: en },
  pcm: { translation: pcm },
  yo: { translation: yo },
  ha: { translation: ha },
  ig: { translation: ig },
};

// Initialize i18n immediately with default language
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default fallback
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
  react: {
    useSuspense: false, // Important for React Native
  },
});

// Load stored language asynchronously after init
const loadStoredLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    console.log("🔍 i18n config: Stored language =", language);
    if (language && resources[language as keyof typeof resources]) {
      await i18n.changeLanguage(language);
      console.log("✅ i18n config: Changed to", language);
    }
  } catch (error) {
    console.error("❌ i18n config: Error loading stored language:", error);
  }
};

// Call it immediately
loadStoredLanguage();

// Add a listener to log language changes
i18n.on("languageChanged", (lng) => {
  console.log("🌐 i18n language changed event:", lng);
});

export default i18n;
