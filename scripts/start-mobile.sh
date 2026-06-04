#!/usr/bin/env bash
# Expo Go üçün — telefon Metro-ya LAN IP ilə qoşulsun
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/mobile"

IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
if [[ -z "$IP" ]]; then
  echo "LAN IP tapılmadı. Tunnel rejimi: npm run start:tunnel"
  exit 1
fi

export REACT_NATIVE_PACKAGER_HOSTNAME="$IP"
echo "Metro host: $IP:8081"
echo "API (.env): EXPO_PUBLIC_API_URL=http://${IP}:8090"
echo ""
echo "Telefonda Expo Go (SDK 54) ilə QR skan edin."
echo "Ağ ekran qalarsa: npm run start:tunnel"
echo ""

exec npx expo start --lan -c "$@"
