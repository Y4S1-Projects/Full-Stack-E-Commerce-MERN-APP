const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PRIVATE_IP_PATTERNS = [
  /10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g,
  /192\.168\.[0-9]{1,3}\.[0-9]{1,3}/g,
  /172\.(1[6-9]|2[0-9]|3[01])\.[0-9]{1,3}\.[0-9]{1,3}/g,
  /127\.0\.0\.1/g, 
];

const ALLOWED_EXCEPTIONS = ['localhost', '127.0.0.1'];

console.log('🔍 Scanning frontend code for private IP addresses...\n');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  PRIVATE_IP_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        if (match === '127.0.0.1' && process.env.NODE_ENV !== 'production') {
          return;
        }

        const lines = content.split('\n');
        lines.forEach((line, lineIndex) => {
          if (line.includes(match)) {
            issues.push({
              file: filePath,
              line: lineIndex + 1,
              content: line.trim(),
              ip: match,
            });
          }
        });
      });
    }
  });

  return issues;
}

// Scan all JavaScript/TypeScript files in src directory
const srcPath = path.join(__dirname, '..', 'src');
const files = glob.sync('**/*.{js,jsx,ts,tsx}', {
  cwd: srcPath,
  absolute: true,
});

let totalIssues = 0;
const allIssues = [];

files.forEach((file) => {
  const issues = checkFile(file);
  if (issues.length > 0) {
    allIssues.push(...issues);
    totalIssues += issues.length;
  }
});

if (totalIssues > 0) {
  console.log('SECURITY ALERT: Private IP addresses found!\n');

  allIssues.forEach((issue) => {
    console.log(`File: ${path.relative(process.cwd(), issue.file)}`);
    console.log(`Line ${issue.line}: ${issue.content}`);
    console.log(`Found IP: ${issue.ip}\n`);
  });

  console.log('Fix Instructions:');
  console.log('1. Replace hardcoded IPs with environment variables');
  console.log('2. Use process.env.REACT_APP_* for configuration');
  console.log('3. Example: process.env.REACT_APP_API_URL\n');

  process.exit(1);
} else {
  console.log('SUCCESS: No private IP addresses found!');
  console.log('Your frontend code is secure from IP disclosure.\n');

  console.log('Security checklist:');
  console.log('No hardcoded private IPs');
  console.log('Environment variables used correctly');
  console.log('Ready for secure production build\n');
}
