<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TimeseriesPoint } from '@/api/currencies'

const props = defineProps<{
  code: string          // target currency (USD, JPY 등)
  name: string
  base: string          // KRW, USD 등
  currentRate: number   // base 1당 target 값
  history: TimeseriesPoint[]
  emoji?: string
}>()

const { t } = useI18n()

// target 1단위(또는 100)당 base 통화 값
const displayUnit = computed(() => {
  if (props.currentRate === 0) return { label: '', value: '' }
  const perUnit = 1 / props.currentRate // target 1당 base
  const fmt = (n: number) =>
    Math.round(n).toLocaleString('ko-KR') + ' ' + props.base
  if (perUnit < 100) {
    return { label: `100 ${props.code}`, value: fmt(perUnit * 100) }
  }
  return { label: `1 ${props.code}`, value: fmt(perUnit) }
})

const changePct = computed(() => {
  if (props.history.length < 2) return 0
  const past = props.history[0].rate
  const cur = props.history[props.history.length - 1].rate
  return ((cur - past) / past) * 100
})

const changeColor = computed(() => {
  const v = changePct.value
  if (v > 1) return 'text-blue-600 dark:text-blue-400'
  if (v < -1) return 'text-red-600 dark:text-red-400'
  return 'text-slate-500 dark:text-slate-400'
})

const chartSeries = computed(() => [
  { name: props.code, data: props.history.map((p) => p.rate) },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    sparkline: { enabled: true },
    animations: { enabled: false },
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { opacityFrom: 0.35, opacityTo: 0 },
  },
  colors: [changePct.value > 0 ? '#2563eb' : '#dc2626'],
  tooltip: { enabled: false },
}))
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-1.5">
        <span class="text-lg leading-none">{{ emoji }}</span>
        <div>
          <div class="text-xs font-semibold text-slate-900 dark:text-slate-100">{{ code }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{{ name }}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm font-bold text-slate-900 dark:text-slate-100">
          {{ displayUnit.value }}
        </div>
        <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ displayUnit.label }}</div>
      </div>
    </div>

    <div v-if="history.length" class="-mx-1 -mb-1">
      <apexchart
        type="area"
        :options="chartOptions"
        :series="chartSeries"
        height="40"
      />
    </div>
    <div
      v-else
      class="h-10 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500"
    >
      {{ t('currency.noSeries') }}
    </div>

    <div class="mt-1 text-[11px]" :class="changeColor">
      {{ t('currency.sixMonth') }}
      <span class="font-medium">
        {{ changePct >= 0 ? '+' : '' }}{{ changePct.toFixed(1) }}%
      </span>
    </div>
  </div>
</template>
