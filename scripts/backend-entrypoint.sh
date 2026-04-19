#!/bin/sh
set -eu

cd /app/apps/backend

echo "Applying Prisma migrations..."
until npx prisma migrate deploy; do
  echo "Database is not ready yet, retrying in 3 seconds..."
  sleep 3
done

if [ "${RUN_PRISMA_SEED:-false}" = "true" ]; then
  echo "Running Prisma seed..."
  npx prisma db seed
fi

echo "Starting backend server..."
exec node dist/index.js
