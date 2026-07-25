#!/bin/bash
# Live Data Sync Script - Run this on NEW VPS
# Syncs data from OLD VPS to NEW VPS without stopping services on OLD VPS

OLD_VPS_IP="OLD_VPS_IP_HERE"  # GANTI dengan IP VPS lama
SYNC_DIR="/root/sync-data"
LOG_FILE="/var/log/sync.log"

mkdir -p $SYNC_DIR

echo "========================================" >> $LOG_FILE
echo "Starting sync from old VPS at $(date)" >> $LOG_FILE

# Sync database dari container
echo "[$(date)] Syncing database..." >> $LOG_FILE
ssh root@$OLD_VPS_IP "docker exec btc-quant-api sqlite3 /app/backend/app/infrastructure/database/btc-quant.db '.backup /tmp/btc-quant.db'" 2>> $LOG_FILE
scp root@$OLD_VPS_IP:/tmp/btc-quant.db $SYNC_DIR/ 2>> $LOG_FILE

# Sync Docker volumes
echo "[$(date)] Syncing Docker volumes..." >> $LOG_FILE
ssh root@$OLD_VPS_IP "docker run --rm -v lana_lana_data:/data -v /tmp:/backup alpine tar czf /backup/lana_data_sync.tar.gz /data" 2>> $LOG_FILE
scp root@$OLD_VPS_IP:/tmp/lana_data_sync.tar.gz $SYNC_DIR/ 2>> $LOG_FILE
docker run --rm -v lana_lana_data:/data -v $SYNC_DIR:/backup alpine tar xzf /backup/lana_data_sync.tar.gz -C / 2>> $LOG_FILE

# Sync PM2 dump
echo "[$(date)] Syncing PM2..." >> $LOG_FILE
scp root@$OLD_VPS_IP:/root/.pm2/dump.pm2 /root/.pm2/ 2>> $LOG_FILE

# Sync Hermes state
echo "[$(date)] Syncing Hermes..." >> $LOG_FILE
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db /root/.hermes/ 2>> $LOG_FILE
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db-shm /root/.hermes/ 2>> $LOG_FILE
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db-wal /root/.hermes/ 2>> $LOG_FILE

# Sync trading-system jika ada perubahan
echo "[$(date)] Syncing trading-system..." >> $LOG_FILE
rsync -avz --delete root@$OLD_VPS_IP:/root/trading-system/ /root/trading-system/ 2>> $LOG_FILE

# Sync /var/www jika ada perubahan
echo "[$(date)] Syncing /var/www..." >> $LOG_FILE
rsync -avz --delete root@$OLD_VPS_IP:/var/www/ /var/www/ 2>> $LOG_FILE

echo "[$(date)] Sync completed" >> $LOG_FILE
echo "========================================" >> $LOG_FILE
