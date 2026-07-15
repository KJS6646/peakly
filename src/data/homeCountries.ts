// 사용자의 "내 나라" 선택 목록. 수도(대표 공항) 좌표를 기준으로 거리 계산.

export type HomeCountry = {
  code: string          // ISO 3166-1 alpha-2
  name: string          // 한글
  nameEn: string
  emoji: string
  currency: string      // ISO 4217
  lat: number
  lng: number
  locale: 'ko' | 'en'   // 기본 언어
  iata: string          // 대표 출발 공항
}

export const HOME_COUNTRIES: HomeCountry[] = [
  { code: 'KR', name: '대한민국', nameEn: 'South Korea', emoji: '🇰🇷', currency: 'KRW', lat: 37.56, lng: 126.97, locale: 'ko', iata: 'ICN' },
  { code: 'JP', name: '일본', nameEn: 'Japan', emoji: '🇯🇵', currency: 'JPY', lat: 35.68, lng: 139.69, locale: 'en', iata: 'HND' },
  { code: 'US', name: '미국', nameEn: 'United States', emoji: '🇺🇸', currency: 'USD', lat: 38.90, lng: -77.04, locale: 'en', iata: 'JFK' },
  { code: 'GB', name: '영국', nameEn: 'United Kingdom', emoji: '🇬🇧', currency: 'GBP', lat: 51.51, lng: -0.13, locale: 'en', iata: 'LHR' },
  { code: 'DE', name: '독일', nameEn: 'Germany', emoji: '🇩🇪', currency: 'EUR', lat: 52.52, lng: 13.40, locale: 'en', iata: 'FRA' },
  { code: 'FR', name: '프랑스', nameEn: 'France', emoji: '🇫🇷', currency: 'EUR', lat: 48.86, lng: 2.35, locale: 'en', iata: 'CDG' },
  { code: 'CN', name: '중국', nameEn: 'China', emoji: '🇨🇳', currency: 'CNY', lat: 39.90, lng: 116.41, locale: 'en', iata: 'PEK' },
  { code: 'TW', name: '대만', nameEn: 'Taiwan', emoji: '🇹🇼', currency: 'TWD', lat: 25.03, lng: 121.57, locale: 'en', iata: 'TPE' },
  { code: 'SG', name: '싱가포르', nameEn: 'Singapore', emoji: '🇸🇬', currency: 'SGD', lat: 1.35, lng: 103.82, locale: 'en', iata: 'SIN' },
  { code: 'HK', name: '홍콩', nameEn: 'Hong Kong', emoji: '🇭🇰', currency: 'HKD', lat: 22.32, lng: 114.17, locale: 'en', iata: 'HKG' },
  { code: 'TH', name: '태국', nameEn: 'Thailand', emoji: '🇹🇭', currency: 'THB', lat: 13.75, lng: 100.50, locale: 'en', iata: 'BKK' },
  { code: 'AU', name: '호주', nameEn: 'Australia', emoji: '🇦🇺', currency: 'AUD', lat: -35.28, lng: 149.13, locale: 'en', iata: 'SYD' },
  { code: 'CA', name: '캐나다', nameEn: 'Canada', emoji: '🇨🇦', currency: 'CAD', lat: 45.42, lng: -75.70, locale: 'en', iata: 'YYZ' },
  { code: 'CH', name: '스위스', nameEn: 'Switzerland', emoji: '🇨🇭', currency: 'CHF', lat: 46.95, lng: 7.45, locale: 'en', iata: 'ZRH' },
]

// 하버사인 공식 (km)
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
