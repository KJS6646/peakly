import { ref, watch } from 'vue'
import { HOME_COUNTRIES, type HomeCountry } from '@/data/homeCountries'
import { setLocale } from '@/i18n'

const STORAGE_KEY = 'peakly-home-country'

function initial(): HomeCountry {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const found = HOME_COUNTRIES.find((c) => c.code === saved)
    if (found) return found
  }
  return HOME_COUNTRIES[0]
}

const home = ref<HomeCountry>(initial())

watch(home, (h) => {
  localStorage.setItem(STORAGE_KEY, h.code)
})

export function useHomeCountry() {
  return {
    home,
    setHome: (c: HomeCountry, syncLocale = false) => {
      home.value = c
      if (syncLocale) setLocale(c.locale)
    },
  }
}
