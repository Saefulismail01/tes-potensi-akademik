# VPS Migration Guide

## Current VPS Inventory

### Docker Containers
- btc-quant-api (port 8000)
- btc-quant-signal-executor
- btc-quant-intraday-monitor
- btc-quant-paper-pullback
- lana-core (port 8000)
- lana-scheduler (port 8000)
- lana-dashboard (nginx on ports 80, 443, 8101)

### Docker Volumes
- lana_lana_data

### PM2 Processes
- alpha-forge
- dashboard-api
- mail-api
- mail-intraday
- mail-signal-exec
- median-lead
- median-lp
- soros-direct

### System Services
- hermes-gateway
- pm2-root
- docker
- nginx (in container)

### Applications in /opt
- /opt/paps (Node.js/Vite app)
- /opt/lana (Python app with docker-compose)
- /opt/quarto (Quarto installation)
- /opt/containerd

### Additional Directories
- /var/www/ (html, paps, tes-potensi-akademik)
- /root/trading-system (Trading system application)
- /home/lana/ (User directory with SSH keys)
- /home/ubuntu/ (User directory with SSH keys)

### SSH Keys
- /root/.ssh/ (authorized_keys, config, deploy_key, id_ed25519, id_mail)
- /home/lana/.ssh/
- /home/ubuntu/.ssh/

### Databases
- btc-quant.db (in docker container)
- Various SQLite databases in /root/.hermes/, /root/.codex/, etc.

### Configuration Files
- /etc/nginx/
- /etc/systemd/system/hermes-gateway.service
- /etc/systemd/system/alpha-forge-trading.service
- /etc/systemd/system/cloudflared.service
- /etc/systemd/system/cloudflared-update.service
- /etc/systemd/system/paps.service
- /etc/systemd/system/trading-system.service
- /etc/cloudflared/config.yml
- /root/.pm2/
- /root/.hermes/
- Cron jobs

### Docker Networks
- alpha_forge_net
- btc_scalping_btc-quant-network
- lana_lana_net

## Migration Strategy

### Option 1: Full System Backup & Restore (Recommended)
1. Create comprehensive backup of entire system
2. Transfer to new VPS
3. Restore and reconfigure

### Option 2: Selective Migration
1. Migrate applications one by one
2. Migrate Docker containers and volumes
3. Migrate PM2 processes
4. Migrate system services
5. Test each component

## Backup Script

Create and run this backup script on the OLD VPS:

```bash
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

echo "Backup completed: /tmp/vps-migration-backup-$(date +%Y%m%d).tar.gz"
echo "Transfer this file to the new VPS"
```

## Migration Steps

### On OLD VPS:

1. **Run the backup script:**
```bash
chmod +x backup-vps.sh
./backup-vps.sh
```

2. **Transfer backup to new VPS:**
```bash
scp /tmp/vps-migration-backup-YYYYMMDD.tar.gz root@NEW_VPS_IP:/tmp/
```

### On NEW VPS:

1. **Install required software:**
```bash
apt update
apt install -y docker.io docker-compose nodejs npm python3 python3-pip nginx sqlite3
systemctl start docker
systemctl enable docker
npm install -g pm2
```

2. **Extract backup:**
```bash
cd /tmp
tar xzf vps-migration-backup-YYYYMMDD.tar.gz
cd vps-migration-backup-YYYYMMDD
```

3. **Restore applications:**
```bash
tar xzf opt-backup.tar.gz -C /
```

4. **Restore Docker volumes:**
```bash
docker volume create lana_lana_data
docker run --rm -v lana_lana_data:/data -v /tmp/vps-migration-backup-YYYYMMDD:/backup alpine tar xzf /backup/lana_lana_data.tar.gz -C /
```

5. **Restore PM2:**
```bash
cp -r .pm2 /root/
pm2 resurrect
```

6. **Restore system configs:**
```bash
cp -r configs/nginx/* /etc/nginx/
cp configs/hermes-gateway.service /etc/systemd/system/
systemctl daemon-reload
```

7. **Restore SSH keys:**
```bash
cp -r .ssh /root/
mkdir -p /home/lana
cp -r home-lana-ssh /home/lana/.ssh
chown -R lana:lana /home/lana/.ssh
mkdir -p /home/ubuntu
cp -r home-ubuntu-ssh /home/ubuntu/.ssh
chown -R ubuntu:ubuntu /home/ubuntu/.ssh
```

8. **Restore /var/www:**
```bash
tar xzf var-www-backup.tar.gz -C /
```

9. **Restore custom systemd services:**
```bash
cp systemd-services/*.service /etc/systemd/system/
systemctl daemon-reload
```

10. **Restore trading-system:**
```bash
tar xzf trading-system-backup.tar.gz -C /
```

11. **Restore cloudflared config:**
```bash
cp -r cloudflared /etc/
```

12. **Restore Docker networks:**
```bash
docker network create alpha_forge_net 2>/dev/null || true
docker network create btc_scalping_btc-quant-network 2>/dev/null || true
docker network create lana_lana_net 2>/dev/null || true
```

13. **Restore Hermes:**
```bash
cp -r .hermes /root/
systemctl enable hermes-gateway
systemctl start hermes-gateway
```

14. **Restore database:**
```bash
# Start btc-quant container first, then:
docker cp btc-quant.db btc-quant-api:/app/backend/app/infrastructure/database/
```

15. **Restore cron jobs:**
```bash
crontab crontab-backup.txt
```

16. **Start Docker containers:**
```bash
cd /opt/lana
docker-compose up -d
```

17. **Verify services:**
```bash
docker ps
pm2 list
systemctl status hermes-gateway
```

## Important Notes

1. **API Keys and Secrets:** The backup contains sensitive API keys. Ensure secure transfer and delete backup after migration.

2. **IP Addresses:** Update any hardcoded IP addresses in configurations to match the new VPS.

3. **DNS:** Update DNS records to point to the new VPS IP.

4. **SSL Certificates:** If using SSL certificates, they need to be regenerated on the new VPS.

5. **Testing:** Test each service individually before switching traffic.

6. **Rollback Plan:** Keep the old VPS running until you've verified everything works on the new VPS.

## Post-Migration Checklist

- [ ] All Docker containers running
- [ ] All PM2 processes running
- [ ] Hermes gateway working
- [ ] Nginx serving correct sites
- [ ] Database connectivity working
- [ ] API endpoints responding
- [ ] Cron jobs executing
- [ ] Logs showing no errors
- [ ] DNS updated
- [ ] SSL certificates valid (if applicable)
