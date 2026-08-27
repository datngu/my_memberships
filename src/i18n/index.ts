import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import no from './no.json'
import vi from './vi.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      no: { translation: no },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi', 'no'],
    interpolation: { escapeValue: false },
  })

export default i18next
