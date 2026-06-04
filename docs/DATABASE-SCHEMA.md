# CertifyApp — PostgreSQL sxeması (user-service)

Flyway: `certifyapp/user-service/src/main/resources/db/migration/`

## Əsas cədvəllər

### `users`
| Sütun | Tip | Qeyd |
|-------|-----|------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE, kiçik hərf |
| password_hash | VARCHAR(255) | BCrypt (auth login) |
| full_name | VARCHAR(255) | |
| role | `user_role` | USER, BUSINESS, ADMIN |

### `businesses`
| Sütun | Tip | Qeyd |
|-------|-----|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| name | VARCHAR(255) | Təşkilat adı |
| verified | BOOLEAN | |

### `events` (tədbirlər)
| Sütun | Tip | Qeyd |
|-------|-----|------|
| id | UUID | PK |
| business_id | UUID | FK → businesses |
| title | VARCHAR(255) | |
| description | TEXT | |
| end_date | TIMESTAMPTZ | Bitmə tarixi |

### `participations` (konullular)
| Sütun | Tip |
|-------|-----|
| id | UUID |
| event_id | UUID → events |
| user_id | UUID → users |
| status | PENDING / COMPLETED / REJECTED |

### `certificates` (V2 genişləndirmə)
`verification_code`, `auth_status` (ISSUED/AUTHENTIC/REVOKED), `business_id`, `event_id`, `holder_name`, `holder_email`, …

## Biznes axını

1. **Web qeydiyyat** → auth `register` → user DB `register-sync` + `businesses/setup`
2. **Tədbir yarat** → `POST /api/v1/businesses/{businessId}/events`
3. **Konullu** → `POST /api/v1/events/{eventId}/attendees`
4. **Sertifikat** → `POST /api/v1/events/{eventId}/issue-certificates`

Auth servisi öz DB-sizdir; istifadəçi parolu **user-service** `users` cədvəlində saxlanılır.
