#!/usr/bin/env bash
# =============================================================================
# SK RELAX BEAUTY ACADEMY & SALON — HOSTINGER VPS INITIAL SETUP SCRIPT
# Prepared by: Cloud Technologies
# Target OS: Ubuntu 26.04 LTS / Ubuntu 24.04 LTS / Ubuntu 22.04 LTS
# =============================================================================

set -e

echo "======================================================================"
echo "   STARTING SK RELAX VPS PROVISIONING"
echo "======================================================================"

# 1. Update system packages
echo "\n>>> 1. Updating APT repositories..."
sudo apt update && sudo apt upgrade -y

# 2. Install essential system dependencies
echo "\n>>> 2. Installing core utilities..."
sudo apt install -y curl wget git ufw build-essential nginx certbot python3-certbot-nginx

# 3. Configure UFW Firewall
echo "\n>>> 3. Configuring UFW Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status verbose

# 4. Install Node.js LTS via NodeSource (Supports Ubuntu 26.04 / 24.04 / 22.04)
echo "\n>>> 4. Verifying / Installing Node.js LTS runtime..."
if command -v node &> /dev/null && [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -ge 20 ]; then
    echo "Compatible Node.js $(node -v) is already installed on this server."
else
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
node -v
npm -v

# 5. Install PM2 globally
echo "\n>>> 5. Installing PM2 process manager..."
sudo npm install -g pm2

# 6. Setup Application Directories
echo "\n>>> 6. Setting up deployment directories..."
sudo mkdir -p /var/www/sk-relax-studio
sudo mkdir -p /var/backups/sk-relax
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/www/sk-relax-studio
sudo chown -R $USER:$USER /var/backups/sk-relax
sudo chown -R $USER:$USER /var/log/pm2

# 7. Setup persistent data and uploads permissions
echo "\n>>> 7. Creating uploads and database directories..."
mkdir -p /var/www/sk-relax-studio/server/data
mkdir -p /var/www/sk-relax-studio/public/uploads/batches
mkdir -p /var/www/sk-relax-studio/public/uploads/services
mkdir -p /var/www/sk-relax-studio/public/uploads/gallery
chmod -R 775 /var/www/sk-relax-studio/server/data
chmod -R 775 /var/www/sk-relax-studio/public/uploads

# 8. Link Nginx Configuration (Bootstrap HTTP)
echo "\n>>> 8. Configuring Nginx..."
if [ -f /var/www/sk-relax-studio/deployment/nginx-initial.conf ]; then
    sudo cp /var/www/sk-relax-studio/deployment/nginx-initial.conf /etc/nginx/sites-available/skrelaxbeauty.com
    sudo ln -sf /etc/nginx/sites-available/skrelaxbeauty.com /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl reload nginx
fi

echo "\n======================================================================"
echo "   INITIAL PROVISIONING COMPLETE!"
echo "   Next steps:"
echo "   1. Add your production .env file: /var/www/sk-relax-studio/.env"
echo "   2. Run: npm install && npm run build"
echo "   3. Start backend: pm2 start ecosystem.config.cjs && pm2 save && pm2 startup"
echo "   4. Obtain SSL: sudo certbot --nginx -d skrelaxbeauty.com -d www.skrelaxbeauty.com"
echo "======================================================================"
