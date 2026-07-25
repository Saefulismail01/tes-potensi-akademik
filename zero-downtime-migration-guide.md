# Zero-Downtime VPS Migration Guide

## Overview
Strategi migrasi tanpa downtime - VPS lama tetap berjalan selama proses migrasi.

## Prerequisites
- VPS baru sudah siap dengan OS yang sama
- Akses SSH ke kedua VPS
- Cukup disk space di VPS baru
- Akses admin ke DNS (jika menggunakan domain)

## Phase 1: Initial Setup (VPS Baru)

### 1. Setup VPS Baru
```bash
# Di VPS BARU
apt update
apt install -y docker.io docker-compose nodejs npm python3 python3-pip nginx sqlite3 rsync
systemctl start docker
systemctl enable docker
npm install -g pm2
```

### 2. Transfer Initial Backup dari VPS Lama
```bash
# Di VPS LAMA - jalankan backup script
chmod +x /opt/paps/backup-vps.sh
/opt/paps/backup-vps.sh

# Transfer ke VPS baru
scp /tmp/vps-migration-backup-YYYYMMDD.tar.gz root@NEW_VPS_IP:/tmp/
```

### 3. Restore di VPS Baru
```bash
# Di VPS BARU
cd /tmp
tar xzf vps-migration-backup-YYYYMMDD.tar.gz
cd vps-migration-backup-YYYYMMDD

# Restore aplikasi
tar xzf opt-backup.tar.gz -C /

# Restore Docker volumes
docker volume create lana_lana_data
docker run --rm -v lana_lana_data:/data -v /tmp/vps-migration-backup-YYYYMMDD:/backup alpine tar xzf /backup/lana_lana_data.tar.gz -C /

# Restore PM2
cp -r .pm2 /root/

# Restore configs
cp -r configs/nginx/* /etc/nginx/
cp configs/hermes-gateway.service /etc/systemd/system/
systemctl daemon-reload

# Restore SSH keys
cp -r .ssh /root/
mkdir -p /home/lana
cp -r home-lana-ssh /home/lana/.ssh
chown -R lana:lana /home/lana/.ssh
mkdir -p /home/ubuntu
cp -r home-ubuntu-ssh /home/ubuntu/.ssh
chown -R ubuntu:ubuntu /home/ubuntu/.ssh

# Restore /var/www
tar xzf var-www-backup.tar.gz -C /

# Restore systemd services
cp systemd-services/*.service /etc/systemd/system/
systemctl daemon-reload

# Restore trading-system
tar xzf trading-system-backup.tar.gz -C /

# Restore cloudflared
cp -r cloudflared /etc/

# Restore Hermes
cp -r .hermes /root/

# Restore Docker networks
docker network create alpha_forge_net 2>/dev/null || true
docker network create btc_scalping_btc-quant-network 2>/dev/null || true
docker network create lana_lana_net 2>/dev/null || true

# Restore cron jobs
crontab crontab-backup.txt
```

### 4. JANGAN Start Services di VPS Baru Dulu!
Services di VPS baru akan di-start nanti setelah data sync selesai.

## Phase 2: Live Data Sync

### Setup Rsync untuk Periodic Sync

Buat script sync di VPS BARU:

```bash
#!/bin/bash
# /root/sync-from-old-vps.sh

OLD_VPS_IP="OLD_VPS_IP"
SYNC_DIR="/root/sync-data"
mkdir -p $SYNC_DIR

echo "Starting sync from old VPS..."

# Sync database dari container
echo "Syncing database..."
ssh root@$OLD_VPS_IP "docker exec btc-quant-api sqlite3 /app/backend/app/infrastructure/database/btc-quant.db '.backup /tmp/btc-quant.db'"
scp root@$OLD_VPS_IP:/tmp/btc-quant.db $SYNC_DIR/

# Sync Docker volumes
echo "Syncing Docker volumes..."
ssh root@$OLD_VPS_IP "docker run --rm -v lana_lana_data:/data -v /tmp:/backup alpine tar czf /backup/lana_data_sync.tar.gz /data"
scp root@$OLD_VPS_IP:/tmp/lana_data_sync.tar.gz $SYNC_DIR/
docker run --rm -v lana_lana_data:/data -v $SYNC_DIR:/backup alpine tar xzf /backup/lana_data_sync.tar.gz -C /

# Sync PM2 dump
echo "Syncing PM2..."
scp root@$OLD_VPS_IP:/root/.pm2/dump.pm2 /root/.pm2/

# Sync Hermes state
echo "Syncing Hermes..."
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db /root/.hermes/
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db-shm /root/.hermes/ 2>/dev/null
rsync -avz root@$OLD_VPS_IP:/root/.hermes/state.db-wal /root/.hermes/ 2>/dev/null

# Sync trading-system jika ada perubahan
echo "Syncing trading-system..."
rsync -avz --delete root@$OLD_VPS_IP:/root/trading-system/ /root/trading-system/

echo "Sync completed at $(date)"
```

Jadwalkan sync setiap 5 menit:

```bash
# Di VPS BARU
chmod +x /root/sync-from-old-vps.sh
crontab -e
# Tambahkan: */5 * * * * /root/sync-from-old-vps.sh >> /var/log/sync.log 2>&1
```

## Phase 3: Final Sync & Cutover

### 1. Stop Services di VPS Lama (Saat Ready untuk Switch)

Pilih waktu dengan traffic rendah (misalnya jam 2-3 pagi):

```bash
# Di VPS LAMA
# Stop services secara graceful
pm2 stop all
docker-compose -f /opt/lana/docker-compose.yml down
systemctl stop hermes-gateway
systemctl stop paps
systemctl stop trading-system
systemctl stop alpha-forge-trading
systemctl stop cloudflared
```

### 2. Final Sync

```bash
# Di VPS BARU - jalankan final sync
/root/sync-from-old-vps.sh

# Manual sync database terakhir
ssh root@OLD_VPS_IP "docker exec btc-quant-api sqlite3 /app/backend/app/infrastructure/database/btc-quant.db '.backup /tmp/btc-quant.db'"
scp root@OLD_VPS_IP:/tmp/btc-quant.db /tmp/
```

### 3. Start Services di VPS Baru

```bash
# Di VPS BARU
# Restore database terakhir
docker cp /tmp/btc-quant.db btc-quant-api:/app/backend/app/infrastructure/database/

# Start Docker containers
cd /opt/lana
docker-compose up -d

# Start PM2
pm2 resurrect

# Start systemd services
systemctl start hermes-gateway
systemctl start paps
systemctl start trading-system
systemctl start alpha-forge-trading
systemctl start cloudflared
```

### 4. Switch Traffic

**Option A: Jika menggunakan Cloudflare Tunnel (cloudflared)**
```bash
# Di VPS BARU - update tunnel configuration
# Edit /etc/cloudflared/config.yml untuk tunnel ke VPS baru
# Atau buat tunnel baru di Cloudflare dashboard
```

**Option B: Jika menggunakan DNS A Record**
```bash
# Update DNS A record di DNS provider
# Point domain ke IP VPS baru
# TTL set ke minimum (300 seconds atau 5 menit)
```

**Option C: Jika menggunakan Load Balancer**
```bash
# Update load balancer configuration
# Remove VPS lama dari pool
# Add VPS baru ke pool
```

### 5. Verify Services di VPS Baru

```bash
# Di VPS BARU
docker ps
pm2 list
systemctl status hermes-gateway
systemctl status paps
systemctl status trading-system

# Test endpoints
curl http://localhost:8000/api/signal
curl http://localhost:8101
```

## Phase 4: Post-Migration

### 1. Monitor VPS Baru (24-48 jam)

```bash
# Check logs
docker logs btc-quant-api --tail 100
pm2 logs
journalctl -u hermes-gateway -f
```

### 2. Setelah VPS Baru Stabil

```bash
# Di VPS LAMA - bisa di-shutdown
# Optional: backup final sebelum shutdown
pm2 stop all
docker-compose -f /opt/lana/docker-compose.yml down
systemctl stop hermes-gateway
```

## Timeline Recommendation

- **Day 1**: Setup VPS baru, initial backup & restore, setup sync script
- **Day 2**: Monitor sync process, test restore di VPS baru (services belum di-start)
- **Day 3**: Final sync & cutover (pilih waktu dengan traffic rendah)

## Important Notes

1. **Database Consistency**: Pastikan database di-sync terakhir saat services di-stop
2. **API Keys**: API keys di VPS baru sama dengan VPS lama
3. **IP Addresses**: Update konfigurasi yang menggunakan IP VPS lama
4. **DNS Propagation**: Tunggu DNS propagate (5-30 menit)
5. **Rollback Plan**: Siap untuk rollback ke VPS lama jika ada masalah
6. **Monitoring**: Monitor VPS baru intensif 24-48 jam setelah cutover

## Rollback Plan (Jika Ada Masalah)

```bash
# Jika ada masalah di VPS baru, rollback ke VPS lama:

# 1. Switch traffic kembali ke VPS lama
# Update DNS atau Cloudflare tunnel

# 2. Start services di VPS lama
cd /opt/lana
docker-compose up -d
pm2 resurrect
systemctl start hermes-gateway
systemctl start paps
systemctl start trading-system

# 3. Debug VPS baru
# Check logs, fix issues, coba lagi nanti
```

## Checklist Sebelum Cutover

- [ ] VPS baru sudah setup dengan semua dependencies
- [ ] Initial backup sudah di-restore ke VPS baru
- [ ] Sync script sudah berjalan dan tested
- [ ] Database sudah di-sync minimal 1 kali
- [ ] Services di VPS baru bisa di-start tanpa error
- [ ] DNS atau load balancer sudah siap untuk switch
- [ ] Rollback plan sudah disiapkan
- [ ] Monitoring tools sudah siap
- [ ] Team sudah di-informasi tentang maintenance window
