#!/usr/bin/env node
/**
 * SK Relax Admin Password Hash Generator
 * Usage: node scripts/generate-admin-hash.js
 *
 * Generates a secure scrypt-based password hash and salt.
 * Paste the output into your .env file.
 * Never commit the .env file to source control.
 */
import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter new admin password: ', (password) => {
  rl.close();
  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters.');
    process.exit(1);
  }
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  console.log('\nAdd the following lines to your .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`ADMIN_PASSWORD_SALT=${salt}`);
  console.log('\nDo NOT share or commit these values.');
});
