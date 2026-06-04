#!/usr/bin/env bash
# Start CertifyApp backend (requires: docker compose infra + mvn install)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MVN="$ROOT/certifyapp/mvnw"
export MAVEN_USER_HOME="${MAVEN_USER_HOME:-$ROOT/.m2}"
export JWT_SECRET="${JWT_SECRET:-change-me-in-production-use-at-least-256-bits-long}"
export DATABASE_URL="${DATABASE_URL:-jdbc:postgresql://localhost:5433/certifyapp}"
export DATABASE_USERNAME="${DATABASE_USERNAME:-certifyapp}"
export DATABASE_PASSWORD="${DATABASE_PASSWORD:-certifyapp}"
export REDIS_PORT="${REDIS_PORT:-6380}"

# Free ports before start
bash "$ROOT/scripts/stop-backend.sh"

cd "$ROOT/certifyapp"
"$MVN" -q install -DskipTests

PIDS=()
cleanup() {
  for pid in "${PIDS[@]}"; do kill "$pid" 2>/dev/null || true; done
  bash "$ROOT/scripts/stop-backend.sh" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait_for_health() {
  local url=$1
  local name=$2
  for i in $(seq 1 60); do
    if curl -sf "$url" >/dev/null 2>&1; then
      echo "  ✓ $name ready"
      return 0
    fi
    sleep 2
  done
  echo "  ✗ $name failed to start — check logs"
  return 1
}

echo "Starting user-service :8082..."
java -jar user-service/target/user-service-0.1.0-SNAPSHOT.jar > /tmp/certify-user.log 2>&1 &
PIDS+=($!)
wait_for_health "http://localhost:8082/actuator/health" "user-service" || tail -20 /tmp/certify-user.log

echo "Starting auth-service :8087..."
java -jar auth-service/target/auth-service-0.1.0-SNAPSHOT.jar > /tmp/certify-auth.log 2>&1 &
PIDS+=($!)
wait_for_health "http://localhost:8087/actuator/health" "auth-service" || tail -20 /tmp/certify-auth.log

echo "Starting api-gateway :8090..."
SERVER_PORT=8090 java -jar api-gateway/target/api-gateway-0.1.0-SNAPSHOT.jar > /tmp/certify-gateway.log 2>&1 &
PIDS+=($!)
wait_for_health "http://localhost:8090/actuator/health" "api-gateway" || tail -20 /tmp/certify-gateway.log

LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo ""
echo "Backend running:"
echo "  Gateway (telefon):  http://${LAN_IP:-YOUR_IP}:8090"
echo "  Gateway (local):    http://localhost:8090"
echo "  Auth:               http://localhost:8087"
echo "  User:               http://localhost:8082"
echo "Logs: /tmp/certify-{user,auth,gateway}.log"
echo "Press Ctrl+C to stop."
wait
