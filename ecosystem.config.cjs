/**
 * SK RELAX BEAUTY ACADEMY & SALON — PM2 ECOSYSTEM CONFIGURATION
 * Prepared by: Cloud Technologies
 * 
 * Manages the production Node.js server under PM2 on Hostinger VPS.
 * Provides auto-restart, crash recovery, memory bounds, and log management.
 */

module.exports = {
  apps: [
    {
      name: 'sk-relax-api',
      script: './server/server.js',
      cwd: '/var/www/sk-relax-studio',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      time: true,
      error_file: '/var/log/pm2/sk-relax-error.log',
      out_file: '/var/log/pm2/sk-relax-out.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1'
      }
    }
  ]
};
