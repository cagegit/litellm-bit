import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, '..', 'src', 'i18n', 'messages');

function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function loadJSON(locale) {
  const path = join(messagesDir, `${locale}.json`);
  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${path}: ${err.message}`);
    process.exit(2);
  }
}

const enData = loadJSON('en');
const zhData = loadJSON('zh');

const enKeys = new Set(extractKeys(enData));
const zhKeys = new Set(extractKeys(zhData));

const missingInZh = [...enKeys].filter((k) => !zhKeys.has(k)).sort();
const missingInEn = [...zhKeys].filter((k) => !enKeys.has(k)).sort();

const hasMismatch = missingInZh.length > 0 || missingInEn.length > 0;

if (!hasMismatch) {
  console.log(`✓ i18n keys are in sync (${enKeys.size} keys in both en and zh)`);
  process.exit(0);
}

console.log('✗ i18n key mismatch detected');

if (missingInZh.length > 0) {
  console.log(`\nMissing in zh (${missingInZh.length}):`);
  for (const key of missingInZh) {
    console.log(`  - ${key}`);
  }
}

if (missingInEn.length > 0) {
  console.log(`\nMissing in en (${missingInEn.length}):`);
  for (const key of missingInEn) {
    console.log(`  - ${key}`);
  }
}

console.log(`\nTotal: en=${enKeys.size}  zh=${zhKeys.size}`);
process.exit(1);
