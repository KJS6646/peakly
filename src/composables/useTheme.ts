import { ref, watch } from 'vue'

const STORAGE_KEY = 'peakly-theme'
type Theme = 'light' | 'dark'

function getInitial(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const theme = ref<Theme>(getInitial())

function apply(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark')
}
apply(theme.value)

watch(theme, (t) => {
  apply(t)
  localStorage.setItem(STORAGE_KEY, t)
})

export function useTheme() {
  return {
    theme,
    toggle: () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    },
  }
}
