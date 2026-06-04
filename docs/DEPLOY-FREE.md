# Pulsuz deploy (gateway olmadan)

Render pulsuz planda **kart olmadan** adətən yalnız **2 web servis** saxlanır. Ona görə **api-gateway** yaratmaq üçün kart tələb olunur. Həll: frontend birbaşa **auth** və **user** servislərinə qoşulur.

## Canlı ünvanlar

| Komponent | URL |
|-----------|-----|
| **Web (biznes)** | https://nemet2006.github.io/certifyapp/ |
| **Auth API** | https://certifyapp-auth.onrender.com |
| **User / biznes API** | https://certifyapp-user.onrender.com |
| ~~Gateway~~ | Lazım deyil (kart tələb edir) |

## Köhnə biznes hesabı

Əvvəlki deploy-da parol user DB-də saxlanmırdı. Yeni versiyadan sonra **web-də yenidən qeydiyyat** edin (eyni email ilə), sonra tədbir yarada bilərsiniz.

## Sizin addımlar (vacib)

1. **GitHub**-da `main` yeniləndikdən sonra Render-da mövcud servisləri **yenidən deploy** edin (yeni servis yox):
   - `certifyapp-user` → **Manual Deploy** (əvvəl)
   - `certifyapp-auth` → **Manual Deploy** (auth user servisinə qoşulur)
2. Web artıq gateway gözləmir; qeydiyyat `auth`, tədbirlər `user` ünvanına gedir.

İlk sorğu 30–60 san gözlətmə normaldır (servis yuxarıdan oyanır).

## Web build (GitHub Pages)

```bash
cd web
npm ci
VITE_BASE_PATH=/certifyapp/ \
VITE_AUTH_URL=https://certifyapp-auth.onrender.com \
VITE_USER_URL=https://certifyapp-user.onrender.com \
npm run build
```

`dist/` məzmununu `gh-pages` branch-ə push edin (və ya Actions workflow).

## Mobil `.env`

```env
EXPO_PUBLIC_AUTH_URL=https://certifyapp-auth.onrender.com
EXPO_PUBLIC_USER_URL=https://certifyapp-user.onrender.com
```

## Lokal

- Auth: `http://localhost:8087`
- User: `http://localhost:8082`
- Gateway (opsional): `http://localhost:8090`

## Gateway (gələcək)

Kart əlavə edib 3-cü web servis yaratsanız, `VITE_API_URL` / `EXPO_PUBLIC_API_URL` ilə tək gateway URL istifadə edə bilərsiniz.
