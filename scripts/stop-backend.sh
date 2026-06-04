#!/usr/bin/env bash
# Stop CertifyApp backend JARs and free ports 8082, 8087, 8090
set -euo pipefail

echo "Stopping CertifyApp backend processes..."
pkill -f "user-service-0.1.0-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "auth-service-0.1.0-SNAPSHOT.jar" 2>/dev/null || true
pkill -f "api-gateway-0.1.0-SNAPSHOT.jar" 2>/dev/null || true

for port in 8082 8087 8090; do
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${port}/tcp" 2>/dev/null || true
  elif command -v lsof >/dev/null 2>&1; then
    pid=$(lsof -ti ":${port}" 2>/dev/null || true)
    if [ -n "$pid" ]; then kill $pid 2>/dev/null || true; fi
  fi
done

sleep 2
echo "Ports 8082, 8087, 8090 should be free now."
