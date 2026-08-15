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
