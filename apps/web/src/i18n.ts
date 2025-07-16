import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

function getLanguageFn() {
  return navigator.language || (navigator as any).userLanguage
}

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    lng: localStorage.getItem('language') || (/cn/i.test(getLanguageFn()) && 'zh') || 'zh',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  })

export default i18n
