# CertifyApp

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%2F%20RN-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Sertifikat platforması — **istifadəçilər** mobil tətbiqdən skan edir, arxivləyir və çap edir; **bizneslər** web portalından tədbir və buraxılışları idarə edir.

## Languages & tech stack

GitHub bu repoda əsasən aşağıdakı dilləri göstərəcək (mənbə koduna görə):

| Dil / format | Harada | Nə üçün |
|--------------|--------|---------|
| **Java** | `certifyapp/` | Spring Boot 3.3 mikroservislər (Java **21**) |
| **TypeScript** | `mobile/`, `web/` | React Native (Expo 54) + Vite React biznes paneli |
| **TSX** | `mobile/src/`, `web/src/` | UI komponentləri və səhifələr |
| **SQL** | `certifyapp/user-service/.../db/migration/` | Flyway migrasiyalar (PostgreSQL) |
| **YAML** | `*.yml`, `docker-compose.yml`, `k8s/` | Spring konfiqurasiya, Docker, Kubernetes |
| **Shell** | `scripts/*.sh`, `certifyapp/mvnw` | Backend/mobil işə salma skriptləri |
| **CSS** | `web/src/index.css` | Tailwind CSS 3.4 |
| **HTML** | `web/index.html`, `notification-service/.../templates/` | Web giriş, email şablonu |
| **JavaScript** | `babel.config.js`, `vite.config.ts` konfiqləri | Build alətləri (əsas məntiq TypeScript-də) |
| **XML** | `pom.xml` | Maven multi-modul layihə |
| **Properties** | `application*.properties` | Spring profillər |
| **Dockerfile** | `docker/Dockerfile.service` | Konteyner image build |

**Əsas runtime:** Node.js (Expo / Vite), JVM 21 (backend), PostgreSQL 16, Redis, RabbitMQ.

**GitHub Languages təxmini paylanma:** Java (backend) ~45–55% · TypeScript/TSX (mobil + web) ~40–50% · SQL, YAML, Shell və digər konfiq ~5–10%.

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

**Web funksiyalar:** Tədbir, konullu əlavə, sertifikat göndərmə, doğrulama (təsdiq/saxta), çap sifarişləri, istifadəçi/biznes API.

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

## Pulsuz deploy (canlı demo)

| | URL |
|--|-----|
| Web panel | https://nemet2006.github.io/certifyapp/ |
| Auth API | https://certifyapp-auth.onrender.com |
| User API | https://certifyapp-user.onrender.com |

Addım-addım: [`docs/DEPLOY-FREE.md`](docs/DEPLOY-FREE.md) · Render: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Nemet2006/certifyapp)

## Lisenziya

MIT (dəyişdirin)
