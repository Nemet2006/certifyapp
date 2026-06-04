# CertifyApp

Sertifikat platforması — **istifadəçilər** mobil tətbiqdən skan edir, arxivləyir və çap edir; **bizneslər** web portalından tədbir və buraxılışları idarə edir.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  mobile/        │     │  api-gateway     │     │  web/ (biznes paneli)   │
│  Expo RN · USER │────▶│  :8090           │◀────│  Vite · BUSINESS        │
└─────────────────┘     └────────┬─────────┘     └─────────────────────────┘
                                   │
                    auth · user · certificate · file · payment · notification
```

## Komponentlər

| Qovluq | Məqsəd |
|--------|--------|
| [`mobile/`](mobile/) | React Native (Expo 54) — skan, arxiv, çap, QR doğrulama |
| [`web/`](web/) | Biznes dashboard — tədbirlər, sertifikatlar, çap sifarişləri |
| [`certifyapp/`](certifyapp/) | Java 21 Spring Boot mikroservislər |
| [`docker/`](docker/) | Postgres, Redis, RabbitMQ |
| [`scripts/`](scripts/) | Backend və mobil işə salma |

## Tez başlanğıc

### 1. Backend

```bash
~/Desktop/sertfkat/docker/docker compose up -d postgres redis rabbitmq
~/Desktop/sertfkat/scripts/stop-backend.sh
~/Desktop/sertfkat/scripts/run-backend.sh
```

Portlar: **Gateway 8090**, Auth 8087, User 8082, Postgres **5433**.

### 2. Biznes web paneli

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

Qeydiyyat **BUSINESS** rolu ilə; proxy `vite.config.ts` → `8090`.

### 3. İstifadəçi mobil tətbiq

```bash
cd mobile
cp .env.example .env   # EXPO_PUBLIC_API_URL=http://KOMPUTER_IP:8090
npm install
npm run start:phone    # Expo Go SDK 54, QR skan
```

**Mobil funksiyalar:** CamScanner tipli skan, qalereya, arxiv, PDF çap (`expo-print`), QR doğrulama, profil.

**Web funksiyalar:** İdarə paneli, tədbirlər (mock UI), verilmiş sertifikatlar, çap sifarişləri, istifadəçi/biznes API.

## Dizayn (Stitch tipli)

- **Rəng palitrası:** ink `#0a1628`, parchment `#f4efe6`, seal `#c9a227`
- **Tipografiya:** Fraunces (başlıqlar) + DM Sans (mətn)
- Mobil və web vizual dil uyğunlaşdırılıb; biznes və istifadəçi axınları ayrılıb

## API (qısa)

| Endpoint | Servis |
|----------|--------|
| `POST /api/v1/auth/register` | Auth |
| `GET /api/v1/users` | User |
| `GET /api/v1/certificates` | Certificate (stub) |
| `POST /api/v1/print-orders` | Payment (stub) |

Tam siyahı: [`certifyapp/api-gateway/src/main/resources/application.yml`](certifyapp/api-gateway/src/main/resources/application.yml)

## Test

```bash
cd certifyapp && ./mvnw verify
~/Desktop/sertfkat/scripts/test-backend.sh
```

## Struktur

Detallı mobil: [`mobile/README.md`](mobile/README.md)

## Lisenziya

MIT (dəyişdirin)
