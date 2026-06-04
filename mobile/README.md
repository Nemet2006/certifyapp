# CertifyApp Mobile (istifadəçi tətbiqi)

Expo SDK **54** — yalnız **USER** axını: skan, arxiv, çap, doğrulama. Biznes paneli [`../web`](../web).

## Funksiyalar

| Ekran | İmkan |
|-------|--------|
| Əsas | Tez keçidlər, son sertifikatlar |
| Skan (mərkəz FAB) | Kamera + qalereya, CamScanner önizləmə |
| Arxiv | Filtrlər, detallar |
| Detal | Paylaş, çap, QR doğrula, sil |
| Çap | `expo-print` sistem dialoqu |
| Doğrula | QR skan — arxiv kodları |
| Profil | Çıxış, developer API URL |

Sertifikatlar **cihazda** saxlanılır (`AsyncStorage`); backend PDF API hazır olanda sinxron əlavə olunacaq.

## Quraşdırma

```bash
npm install
cp .env.example .env
# hostname -I ilə IP yazın
```

## İşə salma

```bash
npm run start:phone   # LAN
npm run start:tunnel  # firewall problemi
```

Expo Go **SDK 54**. **`w` (web) basmayın.**

## Backend

```bash
~/Desktop/sertfkat/scripts/run-backend.sh
```
