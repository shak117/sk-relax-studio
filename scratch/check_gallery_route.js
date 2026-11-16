import fs from 'fs';
const content = fs.readFileSync('server/apiPlugin.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('/api/gallery')) {
    console.log((i+1) + ': ' + l);
  }
});
