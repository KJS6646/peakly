// Deal Score 계산: 환율 유리도 + 날씨 적합도

import type { City } from '@/data/cities'
import { CLIMATE } from '@/data/climate'
import { haversineKm, type HomeCountry } from '@/data/homeCountries'
import type { TimeseriesPoint } from '@/api/currencies'

// 환율 유리도 (0-100): 현재 rate가 지난 6개월 대비 얼마나 자국 통화에 유리한가
// rate = "base 1당 target 값" → 상승 = 자국 통화 강세
export function currencyFavorScore(
  currentRate: number,
  history: TimeseriesPoint[],
): number {
  if (!history.length) return 50
  const values = history.map((p) => p.rate)
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return 50
  const normalized = (currentRate - min) / (max - min)
  return Math.max(0, Math.min(100, normalized * 100))
}

// 최근 30일 대비 변화율(%)
export function recentChangePct(
  currentRate: number,
  history: TimeseriesPoint[],
): number {
  if (history.length < 30) return 0
  const past = history[Math.max(0, history.length - 30)].rate
  return ((currentRate - past) / past) * 100
}

export type CityScore = {
  cityId: string
  weatherScore: number
  currencyScore: number
  dealScore: number
  avgTemp: number
  rainfall: number
  currentRate: number
  changePct: number
  distanceKm: number
}

export function computeCityScore(
  city: City,
  monthIndex: number,
  currentRates: Record<string, number>,
  historyByCurrency: Record<string, TimeseriesPoint[]>,
  home: HomeCountry,
): CityScore {
  const climate = CLIMATE[city.id]
  const weatherScore = climate?.score[monthIndex] ?? 50
  const avgTemp = climate?.avgTemp[monthIndex] ?? 0
  const rainfall = climate?.rainfall[monthIndex] ?? 0

  const currentRate = currentRates[city.currencyCode] ?? 0
  const history = historyByCurrency[city.currencyCode] ?? []
  const currencyScore = currencyFavorScore(currentRate, history)
  const changePct = recentChangePct(currentRate, history)

  const dealScore = weatherScore * 0.6 + currencyScore * 0.4

  const distanceKm = Math.round(haversineKm(home, city))

  return {
    cityId: city.id,
    weatherScore,
    currencyScore,
    dealScore,
    avgTemp,
    rainfall,
    currentRate,
    changePct,
    distanceKm,
  }
}
