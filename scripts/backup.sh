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
   # Envia o backup do dia para o Object Storage (cópia fora da VM).
   # Falha no envio não derruba o backup local: só registra um aviso no log.
   OCI_BIN="${OCI_BIN:-$HOME/bin/oci}"
   OCI_NS="${OCI_NAMESPACE:-grqn0rbik6qq}"
   OCI_BUCKET="${OCI_BUCKET:-polisul-backup-policy}"
   for f in "$DEST/db-$D.sql.gz" "$DEST/uploads-$D.tar.gz"; do
     "$OCI_BIN" os object put --auth instance_principal --namespace-name "$OCI_NS" \
       --bucket-name "$OCI_BUCKET" --file "$f" --force >/dev/null \
       || echo "AVISO: falha ao enviar $f ao Object Storage"
   done
echo "Backup ok: $DEST ($D)"
