// 환율 API
// - open.er-api.com: 현재 환율 (base 지원)
// - frankfurter.dev/v1: 시계열 (ECB 데이터, 주요 통화만)

import axios from 'axios'

// Frankfurter가 지원하는 통화
export const FRANKFURTER_SUPPORTED = new Set([
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY',
  'HKD', 'NZD', 'SGD', 'THB', 'CZK', 'TRY', 'KRW',
])

export type CurrentRates = Record<string, number>

// base 1단위당 각 통화 값 (예: base=KRW, JPY 0.116 → 1원 = 0.116엔)
export async function fetchCurrentRates(base: string): Promise<CurrentRates> {
  const res = await axios.get<{
    result: string
    rates: Record<string, number>
    time_last_update_utc: string
  }>(`https://open.er-api.com/v6/latest/${base}`, { timeout: 8000 })
  if (res.data.result !== 'success') {
    throw new Error('환율 조회 실패')
  }
  return res.data.rates
}

export type TimeseriesPoint = { date: string; rate: number }

// 지난 N일 (base → target) 시계열
// Frankfurter는 EUR 기반이라 우회: EUR→base, EUR→target 조회 후 나눗셈
export async function fetchTimeseries(
  base: string,
  target: string,
  days = 180,
): Promise<TimeseriesPoint[]> {
  if (!FRANKFURTER_SUPPORTED.has(base) || !FRANKFURTER_SUPPORTED.has(target)) {
    return []
  }
  if (base === target) return []

  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const to = [base, target].filter((c) => c !== 'EUR').join(',')
  const toParam = to ? `&to=${to}` : ''
  const url = `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?from=EUR${toParam}`

  const res = await axios.get<{
    rates: Record<string, Record<string, number>>
  }>(url, { timeout: 10000 })

  const points: TimeseriesPoint[] = []
  const sortedDates = Object.keys(res.data.rates).sort()
  for (const date of sortedDates) {
    const day = res.data.rates[date]
    const basePerEur = base === 'EUR' ? 1 : day[base]
    const targetPerEur = target === 'EUR' ? 1 : day[target]
    if (!basePerEur || !targetPerEur) continue
    points.push({ date, rate: targetPerEur / basePerEur })
  }
  return points
}
