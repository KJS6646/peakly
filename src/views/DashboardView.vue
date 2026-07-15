<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CITIES, type City } from '@/data/cities'
import { HOME_COUNTRIES } from '@/data/homeCountries'
import {
  fetchCurrentRates,
  fetchTimeseries,
  FRANKFURTER_SUPPORTED,
  type CurrentRates,
  type TimeseriesPoint,
} from '@/api/currencies'
import { computeCityScore } from '@/lib/dealScore'
import { useTheme } from '@/composables/useTheme'
import { useHomeCountry } from '@/composables/useHomeCountry'
import { setLocale, type Locale } from '@/i18n'
import CurrencyCard from '@/components/CurrencyCard.vue'
import CityRow from '@/components/CityRow.vue'

const { t, tm, rt, locale } = useI18n()
const monthList = computed(() =>
  (tm('months') as string[]).map((m) => rt(m)),
)
const { theme, toggle: toggleTheme } = useTheme()
const { home, setHome } = useHomeCountry()

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)

const currentRates = ref<CurrentRates>({})
const historyByCurrency = ref<Record<string, TimeseriesPoint[]>>({})
const loading = ref(true)
const error = ref('')

type RegionKey = 'all' | City['region']
const selectedRegion = ref<RegionKey>('all')

type SortKey = 'deal' | 'currency' | 'weather'
const sortKey = ref<SortKey>('deal')

const expandedId = ref<string | null>(null)
function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

// 홈 통화 기준으로 표시할 주요 통화 (자국 통화 제외)
const MAIN_CURRENCY_META: Record<string, { name: string; emoji: string }> = {
  KRW: { name: '한국 원', emoji: '🇰🇷' },
  JPY: { name: '일본 엔', emoji: '🇯🇵' },
  USD: { name: '미국 달러', emoji: '🇺🇸' },
  EUR: { name: '유로', emoji: '🇪🇺' },
  THB: { name: '태국 바트', emoji: '🇹🇭' },
  GBP: { name: '영국 파운드', emoji: '🇬🇧' },
  AUD: { name: '호주 달러', emoji: '🇦🇺' },
  SGD: { name: '싱가포르 달러', emoji: '🇸🇬' },
  CHF: { name: '스위스 프랑', emoji: '🇨🇭' },
  HKD: { name: '홍콩 달러', emoji: '🇭🇰' },
  CAD: { name: '캐나다 달러', emoji: '🇨🇦' },
  CNY: { name: '중국 위안', emoji: '🇨🇳' },
  TWD: { name: '대만 달러', emoji: '🇹🇼' },
}

const displayCurrencies = computed(() => {
  const priority = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'THB', 'SGD', 'CHF', 'HKD', 'CAD']
  return priority
    .filter((c) => c !== home.value.currency)
    .slice(0, 8)
    .map((code) => ({ code, ...MAIN_CURRENCY_META[code] }))
})

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    currentRates.value = await fetchCurrentRates(home.value.currency)

    const codes = displayCurrencies.value
      .map((c) => c.code)
      .filter((c) => FRANKFURTER_SUPPORTED.has(c))
    const results = await Promise.allSettled(
      codes.map((c) => fetchTimeseries(home.value.currency, c, 180)),
    )
    const map: Record<string, TimeseriesPoint[]> = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') map[codes[i]] = r.value
    })
    historyByCurrency.value = map
  } catch (e: any) {
    error.value = e.message ?? 'load failed'
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)
watch(() => home.value.currency, loadAll)

const monthIndex = computed(() => selectedMonth.value - 1)

const rankedCities = computed(() => {
  const scored = CITIES.filter(
    (c) => selectedRegion.value === 'all' || c.region === selectedRegion.value,
  ).map((city) => ({
    city,
    score: computeCityScore(
      city,
      monthIndex.value,
      currentRates.value,
      historyByCurrency.value,
      home.value,
    ),
  }))
  const getKey = (s: typeof scored[number]) =>
    sortKey.value === 'currency'
      ? s.score.currencyScore
      : sortKey.value === 'weather'
        ? s.score.weatherScore
        : s.score.dealScore
  return scored.sort((a, b) => getKey(b) - getKey(a))
})

const topPick = computed(() => rankedCities.value[0])
const topCurrency = computed(() => {
  let best: { code: string; changePct: number } | null = null
  for (const c of displayCurrencies.value) {
    const hist = historyByCurrency.value[c.code]
    const cur = currentRates.value[c.code]
    if (!hist || !hist.length || !cur) continue
    const past = hist[0].rate
    const changePct = ((cur - past) / past) * 100
    if (!best || changePct > best.changePct) best = { code: c.code, changePct }
  }
  return best
})

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const REGIONS: RegionKey[] = ['all', 'asia', 'europe', 'oceania', 'americas']
const SORTS: SortKey[] = ['deal', 'currency', 'weather']

// ---- 타임머신 자동재생 ----
const playing = ref(false)
let timer: number | null = null
function togglePlay() {
  if (playing.value) {
    if (timer) window.clearInterval(timer)
    timer = null
    playing.value = false
  } else {
    playing.value = true
    timer = window.setInterval(() => {
      selectedMonth.value = (selectedMonth.value % 12) + 1
    }, 1400)
  }
}

// ---- 언어 토글 ----
function toggleLocale() {
  const next: Locale = locale.value === 'ko' ? 'en' : 'ko'
  setLocale(next)
}

// ---- 국가 선택 드롭다운 ----
const countryOpen = ref(false)
const countryBtn = ref<HTMLElement | null>(null)
const countryPos = ref({ top: 0, right: 0 })

function openCountry() {
  if (countryOpen.value) {
    countryOpen.value = false
    return
  }
  if (countryBtn.value) {
    const rect = countryBtn.value.getBoundingClientRect()
    countryPos.value = {
      top: rect.bottom + 8,
      right: Math.max(8, window.innerWidth - rect.right),
    }
  }
  countryOpen.value = true
}

function pickCountry(code: string) {
  const c = HOME_COUNTRIES.find((h) => h.code === code)
  if (c) setHome(c)
  countryOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (!countryOpen.value) return
  const target = e.target as Node
  if (countryBtn.value?.contains(target)) return
  countryOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div class="w-full px-4 py-2 flex items-center justify-between gap-3">
        <div class="flex items-baseline gap-2">
          <h1 class="text-lg font-bold leading-none">{{ t('app.title') }}</h1>
          <span class="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            {{ t('app.tagline') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <!-- 국가 선택 -->
          <button
            ref="countryBtn"
            @click.stop="openCountry"
            class="flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            :title="t('header.home')"
          >
            <span class="text-lg leading-none">{{ home.emoji }}</span>
            <span class="text-xs font-medium">{{ home.code }}</span>
          </button>
          <Teleport to="body">
            <div
              v-if="countryOpen"
              class="fixed z-50 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
              :style="{
                top: countryPos.top + 'px',
                right: countryPos.right + 'px',
                maxWidth: 'calc(100vw - 16px)',
              }"
              @click.stop
            >
              <div class="text-[10px] uppercase tracking-wide text-slate-400 mb-1.5 px-1">
                {{ t('header.home') }}
              </div>
              <div class="grid grid-cols-5 gap-1.5 w-56 max-w-full">
                <button
                  v-for="c in HOME_COUNTRIES"
                  :key="c.code"
                  @click="pickCountry(c.code)"
                  class="w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all border-2"
                  :class="
                    home.code === c.code
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-700 scale-110 shadow-md'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110'
                  "
                  :title="c.name"
                >
                  {{ c.emoji }}
                </button>
              </div>
            </div>
          </Teleport>

          <!-- 타임머신 -->
          <button
            @click="togglePlay"
            class="px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
            :class="
              playing
                ? 'bg-red-500 text-white'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
            "
            :title="t('header.timemachine')"
          >
            <span>{{ playing ? '⏸' : '▶' }}</span>
            <span class="hidden sm:inline">
              {{ playing ? t('header.pause') : t('header.timemachine') }}
            </span>
          </button>

          <!-- 언어 -->
          <button
            @click="toggleLocale"
            class="px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            :title="t('header.language')"
          >
            {{ locale === 'ko' ? '한' : 'EN' }}
          </button>

          <!-- 다크모드 -->
          <button
            @click="toggleTheme"
            class="px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
            :title="t('header.theme')"
          >
            {{ theme === 'dark' ? '☀️' : '🌙' }}
          </button>

          <select
            v-model="selectedMonth"
            class="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-sm"
          >
            <option v-for="m in MONTHS" :key="m" :value="m">
              {{ monthList[m - 1] }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <div v-if="loading" class="w-full px-4 py-6 text-slate-500 dark:text-slate-400">
      {{ t('loading') }}
    </div>

    <div v-else-if="error" class="w-full px-4 py-6 text-red-600">
      {{ error }}
    </div>

    <main
      v-else
      class="flex-1 min-h-0 w-full px-4 py-3 grid grid-cols-1 lg:grid-cols-12 gap-4"
    >
      <aside class="lg:col-span-5 min-h-0 overflow-y-auto pr-1">
        <h2 class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
          {{ t('currency.title') }}
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <CurrencyCard
            v-for="c in displayCurrencies"
            :key="c.code"
            :code="c.code"
            :name="c.name"
            :emoji="c.emoji"
            :base="home.currency"
            :current-rate="currentRates[c.code] ?? 0"
            :history="historyByCurrency[c.code] ?? []"
          />
        </div>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          {{ t('currency.hint') }}
        </p>

        <div class="mt-3 space-y-2">
          <div
            v-if="topPick"
            class="p-3 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800"
          >
            <div class="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              {{ t('insight.topPick', { month: monthList[monthIndex] }) }}
            </div>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-2xl leading-none">{{ topPick.city.emoji }}</span>
              <div class="flex-1">
                <div class="font-bold">
                  {{ locale === 'ko' ? topPick.city.name : topPick.city.nameEn }}
                  <span class="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                    {{ topPick.city.country }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-400">
                  {{ topPick.score.avgTemp }}°C · {{ topPick.score.rainfall }}mm ·
                  {{ topPick.score.distanceKm.toLocaleString() }} {{ t('ranking.km') }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-emerald-700 dark:text-emerald-400 leading-none">
                  {{ Math.round(topPick.score.dealScore) }}
                </div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400">{{ t('ranking.score') }}</div>
              </div>
            </div>
          </div>

          <div
            v-if="topCurrency"
            class="p-3 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800"
          >
            <div class="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
              {{ t('insight.strongCurrency') }}
            </div>
            <div class="mt-1 flex items-baseline justify-between">
              <div class="font-bold">
                {{ topCurrency.code }}
                <span class="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                  {{ t('insight.strongCurrencyDesc') }}
                </span>
              </div>
              <div class="text-blue-700 dark:text-blue-400 font-semibold">
                +{{ topCurrency.changePct.toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section class="lg:col-span-7 min-h-0 flex flex-col">
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h2 class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {{ t('ranking.goodMonth', { month: monthList[monthIndex] }) }} ·
            {{ t('ranking.cities', { n: rankedCities.length }) }}
          </h2>
          <div class="inline-flex rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden text-xs">
            <button
              v-for="s in SORTS"
              :key="s"
              @click="sortKey = s"
              class="px-2.5 py-1 transition-colors"
              :class="
                sortKey === s
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              "
            >
              {{ t(`ranking.sort.${s}`) }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-2">
          <button
            v-for="r in REGIONS"
            :key="r"
            @click="selectedRegion = r"
            class="px-2.5 py-1 rounded-full text-xs transition-colors border"
            :class="
              selectedRegion === r
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
            "
          >
            {{ t(`ranking.region.${r}`) }}
          </button>
        </div>

        <TransitionGroup
          name="rank"
          tag="div"
          class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-y-auto relative flex-1 min-h-0"
        >
          <CityRow
            v-for="(item, i) in rankedCities"
            :key="item.city.id"
            :city="item.city"
            :score="item.score"
            :rank="i + 1"
            :current-month="monthIndex"
            :expanded="expandedId === item.city.id"
            @toggle="toggleExpand"
          />
        </TransitionGroup>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          {{ t('ranking.footnote') }}
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.rank-move {
  transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
}
.rank-enter-active,
.rank-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}
.rank-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.rank-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.rank-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}
</style>
