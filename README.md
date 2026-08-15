# 0:SEAM Frontend

## Vercel 배포

Vercel 프로젝트 설정에서 다음 값을 사용합니다.

- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

`vercel.json`의 rewrite 설정은 React Router의 직접 URL 접근과 새로고침을 Vercel에서 처리하기 위해 필요합니다.

## 로컬 검증

```bash
npm ci
npm run lint
npm run build
npm run preview
```

## Kakao 지도 설정

1. `.env.example`을 참고해 로컬 `.env` 파일에 `VITE_KAKAO_MAP_APP_KEY`를 설정합니다.
2. Kakao Developers에서 JavaScript 키를 발급하고 `http://localhost:5173` 및 배포 도메인을 JavaScript SDK 도메인으로 등록합니다.

키가 없거나 지도 SDK를 불러오지 못해도 지점 추천 목록과 지점 상세 화면은 계속 표시됩니다.
