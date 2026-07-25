#!/bin/bash
# VPS Migration Backup Script
# Run this on the OLD VPS before migration

BACKUP_DIR="/tmp/vps-migration-backup-$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

echo "Starting backup to $BACKUP_DIR..."

# 1. Backup Docker containers and volumes
echo "Backing up Docker containers..."
docker ps -a --format "{{.Names}}" > $BACKUP_DIR/docker-containers.txt
docker commit btc-quant-api btc-quant-api-backup:$(date +%Y%m%d)
docker commit lana-core lana-core-backup:$(date +%Y%m%d)
docker commit lana-dashboard lana-dashboard-backup:$(date +%Y%m%d)

# Backup Docker volumes
echo "Backing up Docker volumes..."
docker run --rm -v lana_lana_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/lana_lana_data.tar.gz /data

# 2. Backup PM2 processes
echo "Backing up PM2 processes..."
pm2 save
cp -r /root/.pm2 $BACKUP_DIR/

# 3. Backup applications in /opt
echo "Backing up /opt directory..."
tar czf $BACKUP_DIR/opt-backup.tar.gz /opt/paps /opt/lana /opt/quarto

# 4. Backup system configurations
echo "Backing up system configurations..."
mkdir -p $BACKUP_DIR/configs
cp -r /etc/nginx $BACKUP_DIR/configs/
cp /etc/systemd/system/hermes-gateway.service $BACKUP_DIR/configs/

# 5. Backup Hermes configuration
echo "Backing up Hermes..."
cp -r /root/.hermes $BACKUP_DIR/

# 6. Backup databases
echo "Backing up databases..."
docker exec btc-quant-api sqlite3 /app/backend/app/infrastructure/database/btc-quant.db ".backup /tmp/btc-quant.db"
docker cp btc-quant-api:/tmp/btc-quant.db $BACKUP_DIR/

# 7. Backup cron jobs
echo "Backing up cron jobs..."
crontab -l > $BACKUP_DIR/crontab-backup.txt 2>/dev/null

# 8. Backup docker-compose files
echo "Backing up docker-compose files..."
cp /opt/lana/docker-compose.yml $BACKUP_DIR/
cp /opt/lana/docker-compose.parallel.yml $BACKUP_DIR/ 2>/dev/null

# 9. Backup environment files
echo "Backing up environment files..."
cp /opt/lana/.env $BACKUP_DIR/ 2>/dev/null

# 10. Backup SSH keys
echo "Backing up SSH keys..."
cp -r /root/.ssh $BACKUP_DIR/
cp -r /home/lana/.ssh $BACKUP_DIR/home-lana-ssh 2>/dev/null
cp -r /home/ubuntu/.ssh $BACKUP_DIR/home-ubuntu-ssh 2>/dev/null

# 11. Backup /var/www
echo "Backing up /var/www..."
tar czf $BACKUP_DIR/var-www-backup.tar.gz /var/www/

# 12. Backup custom systemd services
echo "Backing up custom systemd services..."
mkdir -p $BACKUP_DIR/systemd-services
cp /etc/systemd/system/alpha-forge-trading.service $BACKUP_DIR/systemd-services/ 2>/dev/null
cp /etc/systemd/system/cloudflared.service $BACKUP_DIR/systemd-services/ 2>/dev/null
cp /etc/systemd/system/cloudflared-update.service $BACKUP_DIR/systemd-services/ 2>/dev/null
cp /etc/systemd/system/paps.service $BACKUP_DIR/systemd-services/ 2>/dev/null
cp /etc/systemd/system/trading-system.service $BACKUP_DIR/systemd-services/ 2>/dev/null

# 13. Backup trading-system
echo "Backing up trading-system..."
tar czf $BACKUP_DIR/trading-system-backup.tar.gz /root/trading-system 2>/dev/null

# 14. Backup cloudflared config
echo "Backing up cloudflared config..."
cp -r /etc/cloudflared $BACKUP_DIR/ 2>/dev/null

# 15. Backup Docker network configurations
echo "Backing up Docker network configurations..."
docker network inspect alpha_forge_net > $BACKUP_DIR/docker-network-alpha_forge_net.json 2>/dev/null
docker network inspect btc_scalping_btc-quant-network > $BACKUP_DIR/docker-network-btc_quant.json 2>/dev/null
docker network inspect lana_lana_net > $BACKUP_DIR/docker-network-lana.json 2>/dev/null

# 16. Create final archive
echo "Creating final archive..."
cd /tmp
tar czf vps-migration-backup-$(date +%Y%m%d).tar.gz vps-migration-backup-$(date +%Y%m%d)/

echo "=========================================="
echo "Backup completed: /tmp/vps-migration-backup-$(date +%Y%m%d).tar.gz"
echo "Transfer this file to the new VPS using:"
echo "scp /tmp/vps-migration-backup-$(date +%Y%m%d).tar.gz root@NEW_VPS_IP:/tmp/"
echo "=========================================="
