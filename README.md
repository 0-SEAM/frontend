# 0:SEAM Frontend

## Vercel 배포

Vercel 프로젝트 설정에서 다음 값을 사용합니다.

- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

`vercel.json`의 rewrite 설정은 React Router의 직접 URL 접근과 새로고침을 Vercel에서 처리하기 위해 필요합니다.

Vercel 환경변수에 백엔드의 공개 Origin을 `VITE_API_BASE_URL`로 설정합니다. 예: `https://api.example.com`.

## 로컬 검증

```bash
npm ci
npm run lint
npm run build
npm run preview
```

로컬에서는 `.env.example`을 참고해 `.env`에 `VITE_API_BASE_URL=http://localhost:8081`을 설정합니다. 프론트가 백엔드에 직접 요청하므로 백엔드의 `app.cors.allowed-origins`에 해당 프론트 Origin을 설정합니다. 배포 환경에서는 `APP_CORS_ALLOWED_ORIGINS`로 덮어쓸 수 있습니다.

## Kakao 지도 설정

1. `.env.example`을 참고해 로컬 `.env` 파일에 `VITE_KAKAO_MAP_APP_KEY`를 설정합니다.
2. Kakao Developers에서 JavaScript 키를 발급하고 `http://localhost:5173` 및 배포 도메인을 JavaScript SDK 도메인으로 등록합니다.

키가 없거나 지도 SDK를 불러오지 못해도 지점 추천 목록과 지점 상세 화면은 계속 표시됩니다.
