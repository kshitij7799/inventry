const fs = require('fs');
const path = require('path');

const logFile = path.resolve(process.cwd(), 'daily-progress-log.md');
const date = new Date().toISOString().slice(0, 10);
const entry = `- ${date}: CI daily auto-commit update`;

let content = '# Daily Progress Log\n\n';
if (fs.existsSync(logFile)) {
  content = fs.readFileSync(logFile, 'utf8');
  if (content.includes(entry)) {
    console.log('Today is already recorded.');
    process.exit(0);
  }
}

if (!content.endsWith('\n')) {
  content += '\n';
}
content += `${entry}\n`;
fs.writeFileSync(logFile, content, 'utf8');
console.log(`Updated ${path.relative(process.cwd(), logFile)}`);
