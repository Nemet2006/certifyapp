# Pulsuz deploy (müvəqqəti)

## Canlı ünvanlar

| Komponent | URL | Platform |
|-----------|-----|----------|
| **Web (biznes)** | https://nemet2006.github.io/certifyapp/ | GitHub Pages (pulsuz) |
| **API** | https://certifyapp-gateway.onrender.com | Render (pulsuz) |

Mobil `.env`:
```
EXPO_PUBLIC_API_URL=https://certifyapp-gateway.onrender.com
```

## 1. Backend — Render (bir dəfə)

1. [Render Dashboard](https://dashboard.render.com/) → **Sign up** (GitHub ilə)
2. **New** → **Blueprint** → repo: `Nemet2006/certifyapp`
3. `render.yaml` avtomatik oxunur → **Apply**
4. 3 web servis + Postgres yaradılır (~10–15 dəq build)
5. Gateway URL: `https://certifyapp-gateway.onrender.com/actuator/health` → `{"status":"UP"}`

**Pulsuz plan:** 15 dəqiqə aktivlik yoxdursa servis yatır; ilk sorğu 30–60 san gözlətmə normaldır.

## 2. Web — GitHub Pages (avtomatik)

`main` branch-ə push olanda `.github/workflows/deploy-pages.yml` işləyir.

İlk dəfə GitHub-da:
**Settings → Pages → Build: GitHub Actions**

## 3. API URL dəyişməsi

Render-də gateway adı fərqlidirsə, GitHub **Settings → Secrets and variables → Actions → Variables**:
- `VITE_API_URL` = `https://SIZIN-GATEWAY.onrender.com`

## Deploy düyməsi

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Nemet2006/certifyapp)
