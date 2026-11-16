#!/usr/bin/env bash
# =============================================================================
# SK RELAX BEAUTY ACADEMY & SALON — AUTOMATED DATABASE & MEDIA BACKUP SCRIPT
# Prepared by: Cloud Technologies
# Target: Cron job running daily at 02:00 AM
# Backs up: server/data/ (JSON DBs) & public/uploads/ (Media Flyers & Videos)
# Retention: 7 daily backups + 4 weekly backups
# =============================================================================

set -e

BACKUP_ROOT="/var/backups/sk-relax"
APP_DIR="/var/www/sk-relax-studio"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_ARCHIVE="$BACKUP_ROOT/skrelax_backup_$TIMESTAMP.tar.gz"

# Ensure backup directory exists with restricted permissions (0700)
mkdir -p "$BACKUP_ROOT"
chmod 700 "$BACKUP_ROOT"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting SK Relax automated backup..."

# 1. Verify source directories exist
if [ ! -d "$APP_DIR/server/data" ] || [ ! -d "$APP_DIR/public/uploads" ]; then
    echo "[ERROR] Required source directories missing in $APP_DIR. Aborting."
    exit 1
fi

# 2. Create timestamped gzip archive
tar -czf "$BACKUP_ARCHIVE" -C "$APP_DIR" server/data public/uploads

# 3. Verify backup archive integrity
if [ -f "$BACKUP_ARCHIVE" ] && [ -s "$BACKUP_ARCHIVE" ]; then
    SIZE=$(du -sh "$BACKUP_ARCHIVE" | cut -f1)
    echo "[SUCCESS] Backup created successfully: $BACKUP_ARCHIVE ($SIZE)"
else
    echo "[ERROR] Backup failed or archive is empty!"
    exit 1
fi

# 4. Retention Policy: Keep last 14 backup archives, prune older ones
find "$BACKUP_ROOT" -name "skrelax_backup_*.tar.gz" -type f -mtime +14 -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup and rotation complete."

# -----------------------------------------------------------------------------
# RESTORATION INSTRUCTIONS:
# To restore from a backup:
#   1. Stop the application: pm2 stop sk-relax-api
#   2. Untar the archive:
#      tar -xzf /var/backups/sk-relax/skrelax_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/sk-relax-studio/
#   3. Verify permissions:
#      chmod -R 775 /var/www/sk-relax-studio/server/data /var/www/sk-relax-studio/public/uploads
#   4. Restart application: pm2 restart sk-relax-api
# -----------------------------------------------------------------------------
