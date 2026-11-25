# SK RELAX BEAUTY ACADEMY & SALON
## Hostinger VPS Production Deployment & Operations Guide

**Prepared by:** Cloud Technologies  
**Target Hardware:** Hostinger VPS KVM 2 (2 vCPU, 4 GB RAM, 50 GB NVMe SSD)  
**Operating System:** Ubuntu 26.04 LTS / Ubuntu 24.04 LTS / Ubuntu 22.04 LTS  
**Primary Domain:** `https://skrelaxbeauty.com` (with `www` redirect)  
**Architecture:** Nginx 1.24+ (Reverse Proxy & Static SPA) + Node.js 20/22 LTS (PM2 Daemon)  

---

## 1. Architecture Overview

```
                      INTERNET / CLIENT BROWSERS
                                  │
                                  ▼
                     UFW FIREWALL (Ports 80 & 443)
                                  │
                                  ▼
                   NGINX 1.24+ (SSL Termination / HTTP/2)
                   ├── Automatic HTTP -> HTTPS 301 Redirect
                   ├── SSL Certificate via Let's Encrypt / Certbot
                   ├── Static Assets from /var/www/sk-relax-studio/dist
                   ├── Video Streaming (/uploads/*) with HTTP 206
                   └── Proxy Pass: /api/ -> http://127.0.0.1:3000
                                  │
                                  ▼
                  PM2 PROCESS MANAGER (Daemon on Port 3000)
                  Node.js Server: server/server.js
                  ├── Salon Services CMS (31 Services)
                  ├── Academy Batches CMS (3 Batches)
                  ├── Gallery CMS (22 Items)
                  ├── Scrypt Authentication & Persistent Rate Limiting
                  └── Atomic Database Storage: server/data/*.json
```

---

## 2. Server Prerequisites

* **Hostinger VPS:** KVM 1, KVM 2, or KVM 4 instance running Ubuntu 22.04 LTS.
* **DNS Records:** Pointed to the Hostinger VPS public IP:
  * `A` Record: `skrelaxbeauty.com` -> `YOUR_SERVER_IP`
  * `A` Record: `www.skrelaxbeauty.com` -> `YOUR_SERVER_IP`
* **SSH Access:** Root or sudo-enabled non-root user credentials.

---

## 3. Step-by-Step Deployment Procedure

### Step 1: Connect to Server & Run Provisioning Script
Connect via SSH to your VPS:
```bash
ssh root@YOUR_SERVER_IP
```

Run system updates and install required runtimes:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw build-essential nginx certbot python3-certbot-nginx

# Configure UFW Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

---

### Step 2: Clone Codebase to `/var/www/sk-relax-studio`
```bash
# Create directory and assign ownership
sudo mkdir -p /var/www/sk-relax-studio
sudo chown -R $USER:$USER /var/www/sk-relax-studio

# Clone repository
cd /var/www/sk-relax-studio
git clone https://github.com/shak117/sk-relax-studio.git .

# Install dependencies
npm install
```

---

### Step 3: Configure Environment Variables
Create the production environment file:
```bash
cp .env.example .env
nano .env
```

Configure the following variables in `.env`:
```env
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
VITE_SITE_URL=https://skrelaxbeauty.com
VITE_META_PIXEL_ID=
VITE_GSC_VERIFICATION_TOKEN=
VITE_REQUIRE_CONSENT=true

# Generate secure admin credentials:
ADMIN_USERNAME=admin
ADMIN_SECRET=GENERATE_A_64_CHAR_RANDOM_HEX_KEY
ADMIN_PASSWORD_HASH=GENERATE_VIA_SCRIPTPASSWORD
ADMIN_PASSWORD_SALT=GENERATE_VIA_SCRIPTPASSWORD
```

To generate a new secure password hash, execute:
```bash
node scripts/generate-admin-hash.js
```
Follow the prompt, enter your strong admin password, and copy the output `ADMIN_PASSWORD_HASH` and `ADMIN_PASSWORD_SALT` into `.env`.

Secure file permissions:
```bash
chmod 600 /var/www/sk-relax-studio/.env
```

---

### Step 4: Build Frontend Assets
Run the optimized production build:
```bash
npm run build
```
*This command executes `sync-services-data.js`, `generate-sitemap.js`, compiles TypeScript, and runs Vite build. The resulting `dist/` directory will be ~270 MB (down from 2.1 GB).*

---

### Step 5: Start Backend with PM2
Launch the production server using the ecosystem configuration:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
*(Copy and execute the `sudo env PATH=...` command shown on the screen to enable automatic startup on server boot).*

Verify process status:
```bash
pm2 status
pm2 logs sk-relax-api --lines 20
```

Test internal health check:
```bash
curl http://127.0.0.1:3000/api/health
```
Expected output:
```json
{"status":"ok","service":"SK Relax API Service","timestamp":"...","uptime":...,"nodeVersion":"..."}
```

---

### Step 6: Configure Nginx & SSL
Copy the initial bootstrap configuration (which listens on HTTP port 80 and enables domain verification):
```bash
sudo cp deployment/nginx-initial.conf /etc/nginx/sites-available/skrelaxbeauty.com
sudo ln -sf /etc/nginx/sites-available/skrelaxbeauty.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Obtain free SSL certificate via Let's Encrypt:
```bash
sudo certbot --nginx -d skrelaxbeauty.com -d www.skrelaxbeauty.com
```

Once certificates are issued, copy the full production HTTPS configuration with HTTP/2 and 1-year asset caching:
```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/skrelaxbeauty.com
sudo nginx -t
sudo systemctl reload nginx
```

Obtain a free SSL certificate from Let's Encrypt:
```bash
sudo certbot --nginx -d skrelaxbeauty.com -d www.skrelaxbeauty.com
```

Select option to redirect all HTTP traffic to HTTPS. Test automatic renewal:
```bash
sudo certbot renew --dry-run
```

---

### Step 7: Configure Automated Daily Backups
Make the backup script executable:
```bash
chmod +x deployment/backup.sh
```

Add a daily cron job running at 2:00 AM:
```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/sk-relax-studio/deployment/backup.sh >> /var/log/skrelax_backup.log 2>&1") | crontab -
```

---

## 4. Disaster Recovery & Restoration Procedure

If database files or uploaded media need to be restored:
```bash
# 1. Stop the application process
pm2 stop sk-relax-api

# 2. Extract the desired backup archive
tar -xzf /var/backups/sk-relax/skrelax_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/sk-relax-studio/

# 3. Ensure permissions are correct
chmod -R 775 /var/www/sk-relax-studio/server/data
chmod -R 775 /var/www/sk-relax-studio/public/uploads

# 4. Restart the application
pm2 restart sk-relax-api
```

---

## 5. Ongoing Maintenance Commands

| Task | Command |
|---|---|
| View live API logs | `pm2 logs sk-relax-api` |
| View Nginx error logs | `sudo tail -f /var/log/nginx/error.log` |
| Restart backend | `pm2 restart sk-relax-api` |
| Reload Nginx | `sudo systemctl reload nginx` |
| Pull git updates & rebuild | `git pull && npm run build && pm2 restart sk-relax-api` |
| Check API health | `curl https://skrelaxbeauty.com/api/health` |

---

## 6. Multi-Client Hosting Isolation (Hostinger KVM 2 VPS)

When sharing this VPS across multiple Cloud Technologies client projects, SK RELAX is completely isolated:

1. **Dedicated Loopback Port**:
   * Default: `PORT=3000` (configurable in `.env` and `ecosystem.config.cjs` to e.g. `3001` or `3005`).
   * Node process strictly binds to `127.0.0.1` so it is never exposed directly on public network interfaces.
2. **Dedicated Nginx Virtual Host**:
   * `/etc/nginx/sites-available/skrelaxbeauty.com` handles only requests for `skrelaxbeauty.com` and `www.skrelaxbeauty.com`.
   * To prevent unmatched domain/IP traffic from falling through to any client, ensure `/etc/nginx/sites-available/00-default.conf` exists:
     ```nginx
     server {
         listen 80 default_server;
         listen [::]:80 default_server;
         server_name _;
         return 444;
     }
     ```
3. **Filesystem & Data Storage Isolation**:
   * Application: `/var/www/sk-relax-studio`
   * Databases: `/var/www/sk-relax-studio/server/data/*.json` (completely self-contained, no shared database daemon)
   * Media Uploads: `/var/www/sk-relax-studio/public/uploads`
   * Dedicated Backups: `/var/backups/sk-relax/` (daily automated tar.gz rotation)
   * Process Name & Logs: `sk-relax-api` -> `/var/log/pm2/sk-relax-*.log`
4. **Independent Environment & Credentials**:
   * Scoped to `/var/www/sk-relax-studio/.env` with `chmod 600`, inaccessible by other non-root system users.

---

## 7. Automated CI/CD Pipeline (GitHub Actions)

Every push to the `main` branch automatically triggers `.github/workflows/deploy.yml`:

1. **Build & Verify Job (GitHub Cloud Runner)**:
   - Uses pinned actions (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`).
   - Runs `npm ci` and `npx tsc --noEmit` to verify zero TypeScript errors.
   - Executes `npm run build` to compile the Vite SPA into `dist/`.
   - Verifies presence and integrity of `dist/index.html`.
   - If anything fails, deployment halts immediately with zero impact on production.

2. **Deploy Job (Hostinger VPS via Secure Helper)**:
   - Authenticates using pre-verified SSH known_hosts and dedicated Ed25519 key (`VPS_SSH_KEY`).
   - Synchronizes application code and `dist/` using `rsync` with strict protect rules.
   - **Preserves Production Data**: `.env`, `server/data/*.json`, and `public/uploads/*` are explicitly protected and never overwritten.
   - Triggers the narrowly-scoped root deployment helper: `sudo /usr/local/bin/skrelax-deploy.sh`.
   - Creates a pre-deployment release backup, updates dependencies (`npm ci --omit=dev`), and safely reloads root PM2 (`sk-relax-api`).
   - Runs automated health check against `http://127.0.0.1:3000/api/health` with automatic rollback on failure.
   - Verifies public domain availability at `https://skrelaxbeautysalonandacademy.cloud/api/health`.

### Required GitHub Secrets (SSH Credentials Only)
Set these in GitHub Repository **Settings** > **Secrets and variables** > **Actions**:
- `VPS_SSH_KEY`: Private Ed25519 SSH Key (`~/.ssh/id_ed25519`)
- `VPS_SSH_KNOWN_HOSTS`: Pre-verified known_hosts entry for `skrelaxbeautysalonandacademy.cloud`

### Scoped Sudoers Rule (`/etc/sudoers.d/skrelax-deploy`)
```sudoers
deploy ALL=(root) NOPASSWD: /usr/local/bin/skrelax-deploy.sh, /usr/local/bin/skrelax-deploy.sh --pre-backup, /usr/local/bin/skrelax-deploy.sh --rollback
```
