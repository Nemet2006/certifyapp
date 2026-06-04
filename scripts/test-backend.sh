#!/usr/bin/env bash
set -euo pipefail
GW="${GATEWAY_URL:-http://localhost:8090}"

echo "Health checks..."
curl -sf "$GW/actuator/health" >/dev/null && echo "  gateway OK"
curl -sf http://localhost:8082/actuator/health >/dev/null && echo "  user-service OK"
curl -sf http://localhost:8087/actuator/health >/dev/null && echo "  auth-service OK"

echo "Register..."
curl -sf -X POST "$GW/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@certifyapp.local","password":"test1234","role":"USER"}' | grep -q accessToken && echo "  register OK"

echo "Create user..."
curl -sf -X POST "$GW/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke-user@certifyapp.local","fullName":"Smoke","role":"USER"}' | grep -q email && echo "  create user OK"

echo "List users..."
curl -sf "$GW/api/v1/users" | grep -q smoke-user && echo "  list users OK"

echo "All smoke tests passed."
