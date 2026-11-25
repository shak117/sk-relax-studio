#!/usr/bin/env bash
# =============================================================================
# SK RELAX BEAUTY ACADEMY & SALON — PRODUCTION DEPLOYMENT HELPER SCRIPT
# Path: /usr/local/bin/skrelax-deploy.sh
# Permissions: 750 (root:root)
# Managed by: Cloud Technologies
# Target: Hostinger VPS (Ubuntu 26.04 / 24.04 LTS)
# 
# Purpose:
# Narrowly-scoped root-owned helper script that safely handles:
# 1. Pre-deployment snapshot of live application code before rsync
# 2. Granular permission enforcement (no broad recursive chmod/chown)
# 3. Production runtime dependency synchronization (npm ci --omit=dev)
# 4. Safe root PM2 reload of sk-relax-api only
# 5. Automated health check with automatic rollback on failure
#
# Usage:
#   sudo /usr/local/bin/skrelax-deploy.sh --pre-backup  # Snapshot live code before rsync
#   sudo /usr/local/bin/skrelax-deploy.sh               # Apply deploy, reload PM2, verify
#   sudo /usr/local/bin/skrelax-deploy.sh --rollback    # Manual rollback to snapshot
# =============================================================================

set -euo pipefail

APP_DIR="/var/www/sk-relax-studio"
BACKUP_DIR="/var/backups/sk-relax/deploy-snapshots"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
ROLLBACK_ARCHIVE="${BACKUP_DIR}/rollback_release.tar.gz"
HISTORY_ARCHIVE="${BACKUP_DIR}/pre_deploy_${TIMESTAMP}.tar.gz"
PM2_BIN="$(command -v pm2 || echo "/usr/bin/pm2")"
PORT="${PORT:-3000}"
HEALTH_URL="http://127.0.0.1:${PORT}/api/health"

# Ensure script is executed with root privileges
if [ "$(id -u)" -ne 0 ]; then
  echo "::error::[DeployHelper] This script must be executed as root (via sudo)." >&2
  exit 1
fi

# Ensure application directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "::error::[DeployHelper] Application directory $APP_DIR does not exist!" >&2
  exit 1
fi

# Ensure snapshot directory exists with restricted access
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# -----------------------------------------------------------------------------
# MODE 1: PRE-BACKUP (Executed before rsync synchronizes new files)
# -----------------------------------------------------------------------------
if [ "${1:-}" = "--pre-backup" ]; then
  echo ">>> [DeployHelper] Capturing snapshot of currently running application code..."
  cd "$APP_DIR"

  if [ -d "dist" ] || [ -d "server" ]; then
    tar -czf "$HISTORY_ARCHIVE" \
      --exclude='server/data' \
      --exclude='public/uploads' \
      --exclude='node_modules' \
      --exclude='.env' \
      --exclude='logs' \
      dist server scripts package.json package-lock.json ecosystem.config.cjs 2>/dev/null || true

    cp -f "$HISTORY_ARCHIVE" "$ROLLBACK_ARCHIVE"
    # Retain the 5 most recent snapshots to prevent disk bloat
    ls -t "${BACKUP_DIR}"/pre_deploy_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -f
    echo ">>> [DeployHelper] Live code snapshot saved to: $ROLLBACK_ARCHIVE"
  else
    echo ">>> [DeployHelper] Initial deployment detected; skipping code snapshot."
  fi
  exit 0
fi

# -----------------------------------------------------------------------------
# MODE 2: ROLLBACK (Restores previous release snapshot)
# -----------------------------------------------------------------------------
if [ "${1:-}" = "--rollback" ]; then
  echo ">>> [DeployHelper] Initiating rollback to previous release snapshot..."
  if [ ! -f "$ROLLBACK_ARCHIVE" ]; then
    echo "::error::[DeployHelper] No rollback snapshot found at $ROLLBACK_ARCHIVE" >&2
    exit 1
  fi

  cd "$APP_DIR"
  echo ">>> [DeployHelper] Extracting $ROLLBACK_ARCHIVE..."
  tar -xzf "$ROLLBACK_ARCHIVE" -C "$APP_DIR"

  echo ">>> [DeployHelper] Reloading root PM2 process: sk-relax-api..."
  export PM2_HOME="/root/.pm2"
  "$PM2_BIN" reload ecosystem.config.cjs --update-env || "$PM2_BIN" reload sk-relax-api

  sleep 3
  HEALTH_CODE="$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")"
  if [ "$HEALTH_CODE" -eq 200 ]; then
    echo ">>> [DeployHelper] Rollback completed successfully and application is healthy (HTTP 200)."
    exit 0
  else
    echo "::error::[DeployHelper] Rollback finished but health check returned HTTP $HEALTH_CODE!" >&2
    exit 1
  fi
fi

# -----------------------------------------------------------------------------
# MODE 3: STANDARD POST-RSYNC DEPLOYMENT & RELOAD
# -----------------------------------------------------------------------------
cd "$APP_DIR"

echo ">>> [1/4] Enforcing granular security permissions..."
# 1. Base directory and application code folders owned by deploy:www-data
chown -R deploy:www-data "$APP_DIR/dist" "$APP_DIR/server" "$APP_DIR/scripts" 2>/dev/null || true
chown deploy:www-data "$APP_DIR/package.json" "$APP_DIR/package-lock.json" "$APP_DIR/ecosystem.config.cjs" 2>/dev/null || true

# 2. Strict protection for customer data and databases:
# Never give 775. Use 750 for directories, 640 for files.
if [ -d "$APP_DIR/server/data" ]; then
  chmod 750 "$APP_DIR/server/data"
  find "$APP_DIR/server/data" -type f -exec chmod 640 {} +
fi

if [ -d "$APP_DIR/public/uploads" ]; then
  chmod 750 "$APP_DIR/public/uploads"
  find "$APP_DIR/public/uploads" -type f -exec chmod 640 {} +
fi

# 3. Secure environment file (readable strictly by root)
if [ -f "$APP_DIR/.env" ]; then
  chmod 600 "$APP_DIR/.env"
  chown root:root "$APP_DIR/.env"
fi

echo ">>> [2/4] Synchronizing production runtime dependencies..."
# Backend uses native Node modules; dependencies are lightweight
npm ci --omit=dev --no-audit --no-fund

echo ">>> [3/4] Reloading root PM2 process: sk-relax-api..."
export PM2_HOME="/root/.pm2"

if "$PM2_BIN" describe sk-relax-api > /dev/null 2>&1; then
  echo ">>> Reloading existing sk-relax-api with updated environment..."
  "$PM2_BIN" reload ecosystem.config.cjs --update-env
else
  echo ">>> Starting sk-relax-api from ecosystem.config.cjs..."
  "$PM2_BIN" start ecosystem.config.cjs
fi
"$PM2_BIN" save

echo ">>> [4/4] Running automated internal health check on $HEALTH_URL..."
sleep 4
HEALTH_CODE="$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")"

if [ "$HEALTH_CODE" -ne 200 ]; then
  echo "::error::[DeployHelper] Internal health check failed with HTTP $HEALTH_CODE!" >&2
  echo ">>> [DeployHelper] Triggering automatic rollback to previous release snapshot..."
  
  if [ -f "$ROLLBACK_ARCHIVE" ]; then
    tar -xzf "$ROLLBACK_ARCHIVE" -C "$APP_DIR"
    export PM2_HOME="/root/.pm2"
    "$PM2_BIN" reload ecosystem.config.cjs --update-env || "$PM2_BIN" reload sk-relax-api
    echo ">>> [DeployHelper] Previous release snapshot restored successfully."
  else
    echo "::error::[DeployHelper] No rollback archive available!" >&2
  fi

  echo "=== PM2 ERROR LOGS ===" >&2
  "$PM2_BIN" logs sk-relax-api --lines 25 --nostream || true
  exit 1
fi

echo ">>> [DeployHelper] SK RELAX deployment succeeded and verified healthy (HTTP 200)."
exit 0
