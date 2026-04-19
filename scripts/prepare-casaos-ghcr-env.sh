#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TARGET_ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"
TEMPLATE_FILE="${ROOT_DIR}/.env.casaos.example"
GITHUB_OWNER="${1:-}"
CASAOS_HOST="${2:-}"

if [ ! -f "$TARGET_ENV_FILE" ]; then
  cp "$TEMPLATE_FILE" "$TARGET_ENV_FILE"
fi

python3 - "$TARGET_ENV_FILE" "$GITHUB_OWNER" "$CASAOS_HOST" <<'PY'
import secrets
import sys
from pathlib import Path

path = Path(sys.argv[1])
owner = sys.argv[2].strip()
host = sys.argv[3].strip()
content = path.read_text()

def replace_value(text: str, key: str, value: str) -> str:
    lines = []
    replaced = False
    for line in text.splitlines():
      if line.startswith(f"{key}="):
        lines.append(f"{key}={value}")
        replaced = True
      else:
        lines.append(line)
    if not replaced:
      lines.append(f"{key}={value}")
    return "\n".join(lines) + "\n"

if owner:
    content = replace_value(content, "BACKEND_IMAGE", f"ghcr.io/{owner}/corp-training-backend:latest")
    content = replace_value(content, "FRONTEND_IMAGE", f"ghcr.io/{owner}/corp-training-frontend:latest")

if host:
    content = replace_value(content, "APP_URL", f"http://{host}:4174")

for key, placeholder in {
    "POSTGRES_PASSWORD": "change-me-now",
    "JWT_SECRET": "change-this-jwt-secret",
    "ADMIN_PASSWORD": "ChangeMe123!",
}.items():
    marker = f"{key}={placeholder}"
    if marker in content:
        length = 24 if key != "JWT_SECRET" else 48
        content = content.replace(marker, f"{key}={secrets.token_urlsafe(length)}")

path.write_text(content)
PY

if [ -n "$GITHUB_OWNER" ]; then
  IMAGE_STATUS="set for $GITHUB_OWNER"
else
  IMAGE_STATUS="left unchanged"
fi

if [ -n "$CASAOS_HOST" ]; then
  APP_URL_STATUS="set to http://$CASAOS_HOST:4174"
else
  APP_URL_STATUS="left unchanged"
fi

cat <<EOF
Prepared $TARGET_ENV_FILE
- BACKEND_IMAGE / FRONTEND_IMAGE $IMAGE_STATUS
- APP_URL $APP_URL_STATUS
- Generated secure defaults for POSTGRES_PASSWORD, JWT_SECRET, and ADMIN_PASSWORD if placeholders were still present

Next:
  sh scripts/deploy-casaos-ghcr.sh
EOF
