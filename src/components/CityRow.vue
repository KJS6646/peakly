<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { City } from '@/data/cities'
import type { CityScore } from '@/lib/dealScore'
import { CLIMATE, scoreToColor, weatherIcon } from '@/data/climate'
import CityDetail from './CityDetail.vue'

const props = defineProps<{
  city: City
  score: CityScore
  rank: number
  currentMonth: number
  expanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

const { t, tm, rt, locale } = useI18n()
const monthList = computed(() =>
  (tm('months') as string[]).map((m) => rt(m)),
)

const weatherColor = computed(() => scoreToColor(props.score.weatherScore))
const weather = computed(() =>
  weatherIcon(props.score.avgTemp, props.score.rainfall),
)

const dealColorClass = computed(() => {
  const d = props.score.dealScore
  if (d >= 85) return 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40'
  if (d >= 70) return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40'
  if (d >= 55) return 'text-lime-700 dark:text-lime-300 bg-lime-100 dark:bg-lime-900/40'
  if (d >= 40) return 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40'
  return 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
})

const changePctFmt = computed(() => {
  const v = props.score.changePct
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
})
const changeColor = computed(() =>
  props.score.changePct > 1
    ? 'text-blue-600 dark:text-blue-400'
    : props.score.changePct < -1
      ? 'text-red-600 dark:text-red-400'
      : 'text-slate-500 dark:text-slate-400',
)

const monthlyScores = computed(() => CLIMATE[props.city.id]?.score ?? [])
const monthlyTemps = computed(() => CLIMATE[props.city.id]?.avgTemp ?? [])
const monthlyRain = computed(() => CLIMATE[props.city.id]?.rainfall ?? [])

const hoverMonth = ref<number | null>(null)
const tipPos = ref({ x: 0, y: 0 })

function onDotEnter(i: number, e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  tipPos.value = { x: rect.left + rect.width / 2, y: rect.top }
  hoverMonth.value = i
}

function monthDotClass(score: number, isCurrent: boolean) {
  const base = isCurrent ? 'ring-1 ring-slate-900 dark:ring-white ring-offset-1 dark:ring-offset-slate-900' : ''
  let color = 'bg-slate-200 dark:bg-slate-700'
  if (score >= 88) color = 'bg-emerald-500'
  else if (score >= 75) color = 'bg-green-400'
  else if (score >= 60) color = 'bg-lime-300'
  else if (score >= 45) color = 'bg-amber-300'
  else if (score >= 30) color = 'bg-orange-300'
  return `${color} ${base}`
}

// 지역별 background — 라이트/다크 대응
const bgTint = computed(() => {
  const s = props.score.weatherScore
  if (s >= 88) return 'bg-emerald-100 dark:bg-emerald-950/40'
  if (s >= 75) return 'bg-green-100 dark:bg-green-950/40'
  if (s >= 60) return 'bg-lime-100 dark:bg-lime-950/40'
  if (s >= 45) return 'bg-amber-100 dark:bg-amber-950/40'
  if (s >= 30) return 'bg-orange-100 dark:bg-orange-950/40'
  return 'bg-slate-200 dark:bg-slate-800'
})

const cityDisplayName = computed(() =>
  locale.value === 'ko' ? props.city.name : props.city.nameEn,
)

function toggle() {
  emit('toggle', props.city.id)
}

function scoreLabelKey(s: number) {
  if (s >= 88) return '최적'
  if (s >= 75) return '좋음'
  if (s >= 60) return '보통'
  if (s >= 45) return '주의'
  if (s >= 30) return '나쁨'
  return '피해야'
}

const distanceFmt = computed(() => {
  const km = props.score.distanceKm
  if (km >= 10000) return (km / 1000).toFixed(1) + 'k'
  return km.toLocaleString()
})
</script>

<template>
  <div class="border-b border-white/50 dark:border-slate-800">
    <div
      class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      :class="[bgTint, expanded ? 'ring-2 ring-inset ring-slate-900 dark:ring-white' : '']"
      @click="toggle"
    >
      <div class="w-5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {{ rank }}
      </div>
      <div class="text-xl leading-none">{{ city.emoji }}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2">
          <span class="font-semibold text-slate-900 dark:text-slate-100">{{ cityDisplayName }}</span>
          <span class="text-xs text-slate-600 dark:text-slate-400">{{ city.country }}</span>
        </div>
        <div class="text-xs mt-0.5 flex items-center gap-2 flex-wrap" :class="weatherColor.text + ' dark:text-slate-300'">
          <span
            class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60"
          >
            <span class="text-sm leading-none">{{ weather.icon }}</span>
            <span class="font-medium">{{ t(`weather.${weather.mood}`) }}</span>
          </span>
          <span>{{ score.avgTemp }}°C · {{ score.rainfall }}mm</span>
          <span class="text-slate-500 dark:text-slate-400">
            ✈ {{ distanceFmt }} {{ t('ranking.km') }}
          </span>
        </div>
      </div>

      <div
        v-if="monthlyScores.length === 12"
        class="hidden md:flex items-end gap-0.5 shrink-0"
        @click.stop
      >
        <div
          v-for="(s, i) in monthlyScores"
          :key="i"
          class="w-1.5 h-4 rounded-sm cursor-pointer transition-transform hover:scale-y-125"
          :class="monthDotClass(s, i === currentMonth)"
          @mouseenter="onDotEnter(i, $event)"
          @mouseleave="hoverMonth = null"
        />
      </div>

      <Teleport to="body">
        <div
          v-if="hoverMonth !== null"
          class="fixed z-50 pointer-events-none whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] px-2 py-1.5 shadow-lg"
          :style="{
            left: tipPos.x + 'px',
            top: tipPos.y - 8 + 'px',
            transform: 'translate(-50%, -100%)',
          }"
        >
          <div class="font-semibold">
            {{ cityDisplayName }} · {{ monthList[hoverMonth] }}
          </div>
          <div class="mt-0.5 opacity-80">
            {{ t('weather.적합도') }} {{ monthlyScores[hoverMonth] }}
            <span class="ml-1 opacity-75">
              ({{ t(`weather.${scoreLabelKey(monthlyScores[hoverMonth])}`) }})
            </span>
          </div>
          <div class="opacity-80">
            {{ monthlyTemps[hoverMonth] }}°C · {{ monthlyRain[hoverMonth] }}mm
          </div>
        </div>
      </Teleport>

      <div class="text-right shrink-0 w-14">
        <div class="text-[10px] text-slate-500 dark:text-slate-400">{{ t('ranking.exchange') }}</div>
        <div class="text-xs font-medium" :class="changeColor">
          {{ changePctFmt }}
        </div>
      </div>
      <div
        class="w-12 text-center rounded px-1.5 py-1 shrink-0"
        :class="dealColorClass"
      >
        <div class="text-[10px] opacity-70">{{ t('ranking.score') }}</div>
        <div class="font-bold text-base leading-none">
          {{ Math.round(score.dealScore) }}
        </div>
      </div>
      <div class="text-slate-400 dark:text-slate-500 text-xs shrink-0 w-3 text-center">
        {{ expanded ? '▲' : '▼' }}
      </div>
    </div>

    <Transition name="expand">
      <CityDetail v-if="expanded" :city="city" />
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 300ms ease, opacity 200ms ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
