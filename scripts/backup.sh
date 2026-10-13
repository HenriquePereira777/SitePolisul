#!/usr/bin/env bash
# Backup diário: banco + fotos enviadas pelo painel. Mantém os últimos 14 dias.
# Uso: ./scripts/backup.sh   (cron: 0 3 * * * /home/ubuntu/polisual/scripts/backup.sh)
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env; set +a
DEST="${BACKUP_DIR:-$HOME/backups}"; mkdir -p "$DEST"
D=$(date +%F)
docker exec polisual-mysql sh -c "mysqldump -uroot -p'$MYSQL_ROOT_PASSWORD' --single-transaction polisual_db" | gzip > "$DEST/db-$D.sql.gz"
docker run --rm --volumes-from polisual-backend -v "$DEST":/b alpine tar czf "/b/uploads-$D.tar.gz" -C /app/uploads . 2>/dev/null || true
find "$DEST" -type f -mtime +14 -delete
echo "Backup ok: $DEST ($D)"
