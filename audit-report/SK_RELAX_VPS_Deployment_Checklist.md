# SK RELAX BEAUTY ACADEMY & SALON
## Hostinger VPS Deployment Checklist & Operations Manual

**Prepared by:** Cloud Technologies  
**Target Platform:** Hostinger VPS (KVM 1 / KVM 2 / KVM 4)  
**Operating System:** Ubuntu 22.04 LTS / Ubuntu 24.04 LTS  
**Architecture:** Nginx (Static Files + SSL + Reverse Proxy) + Node.js (PM2 Process Manager)  
**Domain:** `https://skrelaxbeauty.com` (with `www` redirect)  

---

## 1. System Requirements & Architecture Overview

```
                      INTERNET / CLIENT BROWSERS
                                  │
                                  ▼
                   Hostinger Firewall / UFW (Ports 80, 443)
                                  │
                                  ▼
                     NGINX REVERSE PROXY (Port 443 SSL)
                     ├── Let's Encrypt SSL Certificate
                     ├── Gzip & HTTP/2 Compression
                     ├── Security Headers
                     │
       ┌─────────────┴──────────────────────────────┐
       ▼                                            ▼
Static Content (Fast Path)                  Dynamic API & Uploads
/index.html, /assets/*, /images/*           /api/*, /uploads/*
Path: /var/www/sk-relax-studio/dist         Proxy to: http://127.0.0.1:3000
                                                    │
                                                    ▼
                                            PM2 PROCESS MANAGER
                                            Node.js Service (server/server.js)
                                            ├── Batches & Services CMS
                                            ├── Gallery & Media Uploads
                                            ├── Scrypt Admin Auth
                                            └── Database: server/data/*.json
```

### Server Specifications
* **CPU:** 1 vCPU (minimum), 2 vCPU (recommended)
* **RAM:** 2 GB (minimum), 4 GB (recommended)
* **Disk:** NVMe SSD, minimum 20 GB free space
* **Node.js:** v20.x or v22.x LTS
* **Nginx:** 1.18+ or 1.24+

---

## 2. Phase-by-Phase Deployment Checklist

### Phase A: VPS Initial Server Setup
- [ ] Connect via SSH: `ssh root@YOUR_SERVER_IP`
- [ ] Update packages: `sudo apt update && sudo apt upgrade -y`
- [ ] Install essential packages: `sudo apt install -y curl git ufw build-essential nginx certbot python3-certbot-nginx`
- [ ] Configure UFW Firewall:
  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```
- [ ] Install Node.js v20 LTS via NodeSource:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  node -v && npm -v
  ```
- [ ] Install PM2 globally:
  ```bash
  sudo npm install -g pm2
  ```

---

### Phase B: Repository Clone & Build
- [ ] Create web directory: `sudo mkdir -p /var/www/sk-relax-studio`
- [ ] Set ownership to non-root user (e.g., `deploy` or `ubuntu`):
  ```bash
  sudo chown -R $USER:$USER /var/www/sk-relax-studio
  ```
- [ ] Clone repository:
  ```bash
  cd /var/www/sk-relax-studio
  git clone https://github.com/shak117/sk-relax-studio.git .
  ```
- [ ] Install production dependencies:
  ```bash
  npm install
  ```
- [ ] **Crucial Cleanup:** Remove raw frame ZIP archives before building to prevent bloating `dist/`:
  ```bash
  rm -f public/hero-frames/*.zip
  ```
- [ ] Build production assets:
  ```bash
  npm run build
  ```
  *Verify that `dist/index.html` and `dist/assets/` are created.*

---

### Phase C: Environment & Security Configuration
- [ ] Create `.env` file in `/var/www/sk-relax-studio/.env`:
  ```bash
  cat << 'EOF' > /var/www/sk-relax-studio/.env
  # SK RELAX PRODUCTION ENVIRONMENT
  PORT=3000
  NODE_ENV=production
  VITE_SITE_URL=https://skrelaxbeauty.com
  VITE_META_PIXEL_ID=
  VITE_GSC_VERIFICATION_TOKEN=
  VITE_REQUIRE_CONSENT=true

  # Admin CMS Credentials (Generate strong random keys)
  ADMIN_USERNAME=admin
  ADMIN_SECRET=GENERATE_A_64_CHAR_HEX_KEY
  ADMIN_PASSWORD_HASH=GENERATE_VIA_generate-admin-hash.js
  ADMIN_PASSWORD_SALT=GENERATE_VIA_generate-admin-hash.js
  EOF
  ```
- [ ] Lock down `.env` file permissions:
  ```bash
  chmod 600 /var/www/sk-relax-studio/.env
  ```
- [ ] Ensure database and upload folders have write permissions:
  ```bash
  mkdir -p server/data public/uploads/services public/uploads/batches public/uploads/gallery
  chmod -R 775 server/data public/uploads
  ```

---

### Phase D: PM2 Process Management
- [ ] Create `ecosystem.config.cjs`:
  ```javascript
  module.exports = {
    apps: [
      {
        name: 'sk-relax-api',
        script: './server/server.js',
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
          NODE_ENV: 'production',
          PORT: 3000
        }
      }
    ]
  };
  ```
- [ ] Start backend with PM2:
  ```bash
  pm2 start ecosystem.config.cjs
  pm2 save
  pm2 startup
  ```
  *(Execute the generated `sudo env PATH=...` command to ensure auto-restart on VPS reboot).*

---

### Phase E: Nginx Configuration
- [ ] Create `/etc/nginx/sites-available/skrelaxbeauty.com`:
  ```nginx
  # HTTP — Redirect all traffic to HTTPS
  server {
      listen 80;
      listen [::]:80;
      server_name skrelaxbeauty.com www.skrelaxbeauty.com;
      return 301 https://skrelaxbeauty.com$request_uri;
  }

  # HTTPS — Main Production Server
  server {
      listen 443 ssl http2;
      listen [::]:443 ssl http2;
      server_name skrelaxbeauty.com;

      # SSL Certificates (managed by Certbot)
      # ssl_certificate /etc/letsencrypt/live/skrelaxbeauty.com/fullchain.pem;
      # ssl_certificate_key /etc/letsencrypt/live/skrelaxbeauty.com/privkey.pem;

      root /var/www/sk-relax-studio/dist;
      index index.html;

      # Allow up to 60MB uploads for HD flyers & short reels
      client_max_body_size 60M;

      # Security Headers
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Referrer-Policy "strict-origin-when-cross-origin" always;

      # Gzip Compression
      gzip on;
      gzip_vary on;
      gzip_min_length 1024;
      gzip_proxied any;
      gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

      # 1. API Endpoints — Proxy to Node.js backend
      location /api/ {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_cache_bypass $http_upgrade;
          proxy_read_timeout 120s;
      }

      # 2. Uploaded Media & Video Streaming (HTTP 206 Partial Content)
      location /uploads/ {
          alias /var/www/sk-relax-studio/public/uploads/;
          expires 30d;
          add_header Cache-Control "public, no-transform";
          add_header Access-Control-Allow-Origin "*";
          try_files $uri =404;
      }

      # 3. Static Assets Caching (Vite hash-versioned JS/CSS)
      location /assets/ {
          expires 1y;
          add_header Cache-Control "public, immutable";
          access_log off;
          try_files $uri =404;
      }

      # 4. Single-Page Application (SPA) Fallback Route
      location / {
          try_files $uri $uri/ /index.html;
          add_header Cache-Control "no-cache, must-revalidate";
      }
  }
  ```
- [ ] Enable Nginx site:
  ```bash
  sudo ln -s /etc/nginx/sites-available/skrelaxbeauty.com /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

---

### Phase F: SSL & HTTPS Configuration
- [ ] Ensure DNS A-Records are pointing to the Hostinger VPS IP:
  * `skrelaxbeauty.com` -> `SERVER_IP`
  * `www.skrelaxbeauty.com` -> `SERVER_IP`
- [ ] Obtain SSL certificate:
  ```bash
  sudo certbot --nginx -d skrelaxbeauty.com -d www.skrelaxbeauty.com
  ```
- [ ] Test automatic certificate renewal:
  ```bash
  sudo certbot renew --dry-run
  ```

---

### Phase G: Automated Daily Backups
- [ ] Create backup script `/var/www/sk-relax-studio/scripts/backup-db.sh`:
  ```bash
  #!/bin/bash
  BACKUP_DIR="/var/backups/sk-relax"
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  mkdir -p $BACKUP_DIR
  tar -czf "$BACKUP_DIR/skrelax_data_$TIMESTAMP.tar.gz" -C /var/www/sk-relax-studio server/data public/uploads
  find $BACKUP_DIR -name "skrelax_data_*.tar.gz" -mtime +14 -delete
  ```
- [ ] Make executable and add to crontab:
  ```bash
  chmod +x /var/www/sk-relax-studio/scripts/backup-db.sh
  (crontab -l 2>/dev/null; echo "0 2 * * * /var/www/sk-relax-studio/scripts/backup-db.sh") | crontab -
  ```

---

## 3. Post-Deployment Verification Steps

1. **Verify Homepage:** Load `https://skrelaxbeauty.com` — check hero video playback, typography, and featured batch banner.
2. **Verify Services Catalogue:** Open `/services` — confirm 31 services render with custom flyers.
3. **Verify Admin Login:** Open `/admin/login` — test login with scrypt credentials.
4. **Test Live CMS Edit:** In `/admin/services`, edit a service title and verify it immediately updates on `/services`.
5. **Test Media Upload:** Upload a flyer in CMS and verify it displays properly and persists in `/uploads/services/`.
6. **Test Server Restart Resilience:** Run `sudo reboot`, wait 1 minute, and verify both Nginx and PM2 restart automatically.
