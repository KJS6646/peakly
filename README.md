# Peakly

**언제 어디로 떠나야 좋은지, 한눈에.**

여행 예정 시기(년/월)를 선택하면 30개 인기 여행 도시를 환율 유리도 + 날씨 적합도로 조합한 Deal Score로 순위 매겨 보여줍니다.

## 스택

- Vue 3 + TypeScript + Vite
- Tailwind CSS v4
- ApexCharts (스파크라인)
- 외부 무료 API: open.er-api.com, frankfurter.app

## 실행

```
npm install
npm run dev
```

기본 포트: 5174

## 구조

```
src/
  data/        # 도시 큐레이션, 월별 기후 정적 데이터
  api/         # 환율 fetch
  lib/         # Deal Score 계산
  components/  # CurrencyCard, CityRow
  views/       # DashboardView
_changelog/    # 변경 이력
```

## 변경 로그

`_changelog/` 폴더 참고. 모든 기능 변경 시 `{종류}_{대상}_{YYYYMMDDHHMM}.txt` 생성.
