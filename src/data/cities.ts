// 인기 여행 도시 큐레이션 (30개)
// currencyCode: ISO 4217, iata: 대표 공항, lat/lng: 거리 계산용

export type City = {
  id: string
  name: string
  nameEn: string
  country: string
  currencyCode: string
  region: 'asia' | 'europe' | 'oceania' | 'americas' | 'africa'
  emoji: string
  timezone: string
  iata: string
  lat: number
  lng: number
}

export const CITIES: City[] = [
  { id: 'tokyo', name: '도쿄', nameEn: 'Tokyo', country: '일본', currencyCode: 'JPY', region: 'asia', emoji: '🇯🇵', timezone: 'Asia/Tokyo', iata: 'HND', lat: 35.68, lng: 139.69 },
  { id: 'osaka', name: '오사카', nameEn: 'Osaka', country: '일본', currencyCode: 'JPY', region: 'asia', emoji: '🇯🇵', timezone: 'Asia/Tokyo', iata: 'KIX', lat: 34.69, lng: 135.50 },
  { id: 'fukuoka', name: '후쿠오카', nameEn: 'Fukuoka', country: '일본', currencyCode: 'JPY', region: 'asia', emoji: '🇯🇵', timezone: 'Asia/Tokyo', iata: 'FUK', lat: 33.59, lng: 130.40 },
  { id: 'okinawa', name: '오키나와', nameEn: 'Okinawa', country: '일본', currencyCode: 'JPY', region: 'asia', emoji: '🇯🇵', timezone: 'Asia/Tokyo', iata: 'OKA', lat: 26.20, lng: 127.68 },
  { id: 'bangkok', name: '방콕', nameEn: 'Bangkok', country: '태국', currencyCode: 'THB', region: 'asia', emoji: '🇹🇭', timezone: 'Asia/Bangkok', iata: 'BKK', lat: 13.75, lng: 100.50 },
  { id: 'chiangmai', name: '치앙마이', nameEn: 'Chiang Mai', country: '태국', currencyCode: 'THB', region: 'asia', emoji: '🇹🇭', timezone: 'Asia/Bangkok', iata: 'CNX', lat: 18.79, lng: 98.98 },
  { id: 'phuket', name: '푸켓', nameEn: 'Phuket', country: '태국', currencyCode: 'THB', region: 'asia', emoji: '🇹🇭', timezone: 'Asia/Bangkok', iata: 'HKT', lat: 7.88, lng: 98.39 },
  { id: 'danang', name: '다낭', nameEn: 'Da Nang', country: '베트남', currencyCode: 'VND', region: 'asia', emoji: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', iata: 'DAD', lat: 16.05, lng: 108.20 },
  { id: 'hanoi', name: '하노이', nameEn: 'Hanoi', country: '베트남', currencyCode: 'VND', region: 'asia', emoji: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', iata: 'HAN', lat: 21.03, lng: 105.85 },
  { id: 'nhatrang', name: '나트랑', nameEn: 'Nha Trang', country: '베트남', currencyCode: 'VND', region: 'asia', emoji: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', iata: 'CXR', lat: 12.24, lng: 109.19 },
  { id: 'bali', name: '발리', nameEn: 'Bali', country: '인도네시아', currencyCode: 'IDR', region: 'asia', emoji: '🇮🇩', timezone: 'Asia/Makassar', iata: 'DPS', lat: -8.65, lng: 115.22 },
  { id: 'cebu', name: '세부', nameEn: 'Cebu', country: '필리핀', currencyCode: 'PHP', region: 'asia', emoji: '🇵🇭', timezone: 'Asia/Manila', iata: 'CEB', lat: 10.31, lng: 123.90 },
  { id: 'boracay', name: '보라카이', nameEn: 'Boracay', country: '필리핀', currencyCode: 'PHP', region: 'asia', emoji: '🇵🇭', timezone: 'Asia/Manila', iata: 'KLO', lat: 11.97, lng: 121.93 },
  { id: 'taipei', name: '타이베이', nameEn: 'Taipei', country: '대만', currencyCode: 'TWD', region: 'asia', emoji: '🇹🇼', timezone: 'Asia/Taipei', iata: 'TPE', lat: 25.03, lng: 121.57 },
  { id: 'singapore', name: '싱가포르', nameEn: 'Singapore', country: '싱가포르', currencyCode: 'SGD', region: 'asia', emoji: '🇸🇬', timezone: 'Asia/Singapore', iata: 'SIN', lat: 1.35, lng: 103.82 },
  { id: 'hongkong', name: '홍콩', nameEn: 'Hong Kong', country: '홍콩', currencyCode: 'HKD', region: 'asia', emoji: '🇭🇰', timezone: 'Asia/Hong_Kong', iata: 'HKG', lat: 22.32, lng: 114.17 },
  { id: 'macau', name: '마카오', nameEn: 'Macau', country: '마카오', currencyCode: 'HKD', region: 'asia', emoji: '🇲🇴', timezone: 'Asia/Macau', iata: 'MFM', lat: 22.20, lng: 113.55 },
  { id: 'paris', name: '파리', nameEn: 'Paris', country: '프랑스', currencyCode: 'EUR', region: 'europe', emoji: '🇫🇷', timezone: 'Europe/Paris', iata: 'CDG', lat: 48.86, lng: 2.35 },
  { id: 'rome', name: '로마', nameEn: 'Rome', country: '이탈리아', currencyCode: 'EUR', region: 'europe', emoji: '🇮🇹', timezone: 'Europe/Rome', iata: 'FCO', lat: 41.90, lng: 12.50 },
  { id: 'barcelona', name: '바르셀로나', nameEn: 'Barcelona', country: '스페인', currencyCode: 'EUR', region: 'europe', emoji: '🇪🇸', timezone: 'Europe/Madrid', iata: 'BCN', lat: 41.39, lng: 2.17 },
  { id: 'london', name: '런던', nameEn: 'London', country: '영국', currencyCode: 'GBP', region: 'europe', emoji: '🇬🇧', timezone: 'Europe/London', iata: 'LHR', lat: 51.51, lng: -0.13 },
  { id: 'zurich', name: '취리히', nameEn: 'Zurich', country: '스위스', currencyCode: 'CHF', region: 'europe', emoji: '🇨🇭', timezone: 'Europe/Zurich', iata: 'ZRH', lat: 47.38, lng: 8.54 },
  { id: 'prague', name: '프라하', nameEn: 'Prague', country: '체코', currencyCode: 'CZK', region: 'europe', emoji: '🇨🇿', timezone: 'Europe/Prague', iata: 'PRG', lat: 50.08, lng: 14.44 },
  { id: 'istanbul', name: '이스탄불', nameEn: 'Istanbul', country: '튀르키예', currencyCode: 'TRY', region: 'europe', emoji: '🇹🇷', timezone: 'Europe/Istanbul', iata: 'IST', lat: 41.01, lng: 28.98 },
  { id: 'sydney', name: '시드니', nameEn: 'Sydney', country: '호주', currencyCode: 'AUD', region: 'oceania', emoji: '🇦🇺', timezone: 'Australia/Sydney', iata: 'SYD', lat: -33.87, lng: 151.21 },
  { id: 'auckland', name: '오클랜드', nameEn: 'Auckland', country: '뉴질랜드', currencyCode: 'NZD', region: 'oceania', emoji: '🇳🇿', timezone: 'Pacific/Auckland', iata: 'AKL', lat: -36.85, lng: 174.76 },
  { id: 'guam', name: '괌', nameEn: 'Guam', country: '괌', currencyCode: 'USD', region: 'oceania', emoji: '🇬🇺', timezone: 'Pacific/Guam', iata: 'GUM', lat: 13.44, lng: 144.79 },
  { id: 'saipan', name: '사이판', nameEn: 'Saipan', country: '북마리아나', currencyCode: 'USD', region: 'oceania', emoji: '🇲🇵', timezone: 'Pacific/Saipan', iata: 'SPN', lat: 15.18, lng: 145.75 },
  { id: 'honolulu', name: '호놀룰루', nameEn: 'Honolulu', country: '하와이', currencyCode: 'USD', region: 'americas', emoji: '🇺🇸', timezone: 'Pacific/Honolulu', iata: 'HNL', lat: 21.31, lng: -157.86 },
  { id: 'losangeles', name: 'LA', nameEn: 'Los Angeles', country: '미국', currencyCode: 'USD', region: 'americas', emoji: '🇺🇸', timezone: 'America/Los_Angeles', iata: 'LAX', lat: 34.05, lng: -118.24 },
  { id: 'newyork', name: '뉴욕', nameEn: 'New York', country: '미국', currencyCode: 'USD', region: 'americas', emoji: '🇺🇸', timezone: 'America/New_York', iata: 'JFK', lat: 40.71, lng: -74.01 },
  { id: 'vancouver', name: '밴쿠버', nameEn: 'Vancouver', country: '캐나다', currencyCode: 'CAD', region: 'americas', emoji: '🇨🇦', timezone: 'America/Vancouver', iata: 'YVR', lat: 49.28, lng: -123.12 },
]
