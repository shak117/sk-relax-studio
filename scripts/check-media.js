import fs from 'fs';
import path from 'path';

const pub = path.resolve('public');
let missing = [];
let total = 0;

['teamData.ts', 'eventsData.ts', 'studentFeedbackData.ts', 'academyData.ts'].forEach(f => {
  const txt = fs.readFileSync(path.join('src', 'data', f), 'utf8');
  const regex = /\/(images|videos|uploads)\/[^'"\s\)]+/g;
  let match;
  while ((match = regex.exec(txt)) !== null) {
    total++;
    const p = path.resolve(pub, match[0].replace(/^\//, ''));
    if (!fs.existsSync(p)) {
      missing.push({ file: f, path: match[0] });
    }
  }
});

console.log('Total checked:', total, 'Missing:', missing.length);
if (missing.length) {
  console.log(missing);
}
