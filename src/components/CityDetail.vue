<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { City } from '@/data/cities'
import { useHomeCountry } from '@/composables/useHomeCountry'

const props = defineProps<{
  city: City
}>()

const { t } = useI18n()
const { home } = useHomeCountry()

type TabKey = 'info' | 'stay' | 'flight'
const activeTab = ref<TabKey>('info')

const encodedName = computed(() => encodeURIComponent(props.city.nameEn))
const encodedNameKo = computed(() => encodeURIComponent(props.city.name))

const infoLinks = computed(() => [
  {
    label: 'Google Travel',
    url: `https://www.google.com/travel/things-to-do?q=${encodedName.value}`,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Naver',
    url: `https://search.naver.com/search.naver?query=${encodedNameKo.value}+여행`,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Wikitravel',
    url: `https://wikitravel.org/en/${encodedName.value}`,
    color: 'bg-slate-600 hover:bg-slate-700',
  },
  {
    label: 'Tripadvisor',
    url: `https://www.tripadvisor.com/Search?q=${encodedName.value}`,
    color: 'bg-emerald-600 hover:bg-emerald-700',
  },
])

const stayLinks = computed(() => [
  {
    label: 'Agoda',
    url: `https://www.agoda.com/search?city=${encodedName.value}`,
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    label: 'Trip.com',
    url: `https://www.trip.com/hotels/list?city=${encodedName.value}`,
    color: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    label: 'Booking.com',
    url: `https://www.booking.com/searchresults.html?ss=${encodedName.value}`,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    label: 'Airbnb',
    url: `https://www.airbnb.com/s/${encodedName.value}/homes`,
    color: 'bg-rose-500 hover:bg-rose-600',
  },
  {
    label: 'Hotels.com',
    url: `https://www.hotels.com/search.do?q-destination=${encodedName.value}`,
    color: 'bg-red-600 hover:bg-red-700',
  },
])

const flightSearchLinks = computed(() => [
  {
    label: 'Skyscanner',
    url: `https://www.skyscanner.com/transport/flights/${home.value.iata.toLowerCase()}/${props.city.iata.toLowerCase()}/`,
    color: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    label: 'Google Flights',
    url: `https://www.google.com/travel/flights?q=Flights+from+${home.value.iata}+to+${props.city.iata}`,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Kayak',
    url: `https://www.kayak.com/flights/${home.value.iata}-${props.city.iata}`,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
])

const TABS: { key: TabKey; icon: string }[] = [
  { key: 'info', icon: '🗺️' },
  { key: 'stay', icon: '🏨' },
  { key: 'flight', icon: '✈️' },
]
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
    <div class="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px"
        :class="
          activeTab === tab.key
            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        "
      >
        <span class="mr-1">{{ tab.icon }}</span>{{ t(`detail.tab.${tab.key}`) }}
      </button>
    </div>

    <div class="p-4">
      <div v-if="activeTab === 'info'">
        <div class="grid grid-cols-3 gap-3 mb-3 text-xs">
          <div class="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <div class="text-slate-500 dark:text-slate-400">{{ t('detail.country') }}</div>
            <div class="font-semibold text-slate-900 dark:text-slate-100">{{ city.country }}</div>
          </div>
          <div class="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <div class="text-slate-500 dark:text-slate-400">{{ t('detail.currency') }}</div>
            <div class="font-semibold text-slate-900 dark:text-slate-100">{{ city.currencyCode }}</div>
          </div>
          <div class="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <div class="text-slate-500 dark:text-slate-400">{{ t('detail.airport') }}</div>
            <div class="font-semibold text-slate-900 dark:text-slate-100">{{ city.iata }}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="l in infoLinks"
            :key="l.label"
            :href="l.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded text-white text-xs font-medium transition-colors"
            :class="l.color"
          >
            {{ l.label }} ↗
          </a>
        </div>
      </div>

      <div v-else-if="activeTab === 'stay'">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {{ t('detail.stayHint') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="l in stayLinks"
            :key="l.label"
            :href="l.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded text-white text-xs font-medium transition-colors"
            :class="l.color"
          >
            {{ l.label }} ↗
          </a>
        </div>
      </div>

      <div v-else-if="activeTab === 'flight'">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {{ t('detail.flightHint', { from: home.iata, to: city.iata }) }}
        </p>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="l in flightSearchLinks"
            :key="l.label"
            :href="l.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded text-white text-xs font-medium transition-colors"
            :class="l.color"
          >
            {{ l.label }} ↗
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
