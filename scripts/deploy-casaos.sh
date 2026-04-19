#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ENV_FILE="${ROOT_DIR}/.env"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.casaos.yml"

if [ ! -f "$ENV_FILE" ]; then
  cp "${ROOT_DIR}/.env.casaos.example" "$ENV_FILE"
  echo "Created .env from .env.casaos.example"
  echo "Edit $ENV_FILE first, then run this script again."
  exit 0
fi

exec docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build
