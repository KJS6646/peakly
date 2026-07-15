import { createI18n } from 'vue-i18n'
import ko from './locales/ko'
import en from './locales/en'

export type Locale = 'ko' | 'en'

const STORAGE_KEY = 'peakly-locale'

function initialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved === 'ko' || saved === 'en') return saved
  return navigator.language.startsWith('ko') ? 'ko' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { ko, en },
})

export function setLocale(l: Locale) {
  i18n.global.locale.value = l
  localStorage.setItem(STORAGE_KEY, l)
}
