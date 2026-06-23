import { readFileSync, readdirSync } from "node:fs";
import { extname, join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "src", "i18n", "messages");

function extractKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function extractMessages(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? extractMessages(value, full)
      : [[full, value]];
  });
}

function loadJSON(locale) {
  const path = join(messagesDir, `${locale}.json`);
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${path}: ${err.message}`);
    process.exit(2);
  }
}

const enData = loadJSON("en");
const zhData = loadJSON("zh");

const enKeys = new Set(extractKeys(enData));
const zhKeys = new Set(extractKeys(zhData));
const zhMessages = new Map(extractMessages(zhData));

const missingInZh = [...enKeys].filter((k) => !zhKeys.has(k)).sort();
const missingInEn = [...zhKeys].filter((k) => !enKeys.has(k)).sort();
const placeholderPattern = /\{(\w+)\}/g;
const placeholders = (message) => [...String(message).matchAll(placeholderPattern)].map((match) => match[1]).sort();
const placeholderMismatches = extractMessages(enData)
  .filter(
    ([key, message]) =>
      zhMessages.has(key) && placeholders(message).join() !== placeholders(zhMessages.get(key)).join(),
  )
  .map(([key]) => key)
  .sort();

const sourceRoot = join(__dirname, "..", "src");
const sourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return [".ts", ".tsx"].includes(extname(entry.name)) && !entry.name.includes(".test.") ? [path] : [];
  });
const sourceErrors = [];
const sourceWarnings = [];

for (const path of sourceFiles(sourceRoot)) {
  const source = readFileSync(path, "utf8");
  const namespacePattern = /\buseTranslations\(\s*['"]([^'"]+)['"]\s*\)/g;
  const namespaceMatches = [...source.matchAll(namespacePattern)];
  if (namespaceMatches.length === 0) continue;
  const literalPattern = /\bt\(\s*['"]([^'"]+)['"]/g;
  const dynamicPattern = /\bt\(\s*(?!['"])([^,\n)]+)/g;
  const displayPath = relative(sourceRoot, path);
  for (const namespaceMatch of namespaceMatches) {
    const start = namespaceMatch.index + namespaceMatch[0].length;
    const nextNamespace = namespaceMatches.find((match) => match.index > namespaceMatch.index);
    const section = source.slice(start, nextNamespace?.index ?? source.length);
    const namespace = namespaceMatch[1];
    for (const match of section.matchAll(literalPattern)) {
      const key = match[1];
      const fullKey = `${namespace}.${key}`;
      if (key.startsWith(`${namespace}.`)) {
        sourceErrors.push(`${displayPath}: t('${key}') duplicates namespace '${namespace}'`);
      } else if (!enKeys.has(fullKey)) {
        sourceErrors.push(`${displayPath}: missing translation key '${fullKey}'`);
      }
    }
    for (const match of section.matchAll(dynamicPattern)) {
      sourceWarnings.push(`${displayPath}: dynamic translation call t(${match[1].trim()})`);
    }
  }
}

const hasMismatch =
  missingInZh.length > 0 || missingInEn.length > 0 || placeholderMismatches.length > 0 || sourceErrors.length > 0;

if (!hasMismatch) {
  console.log(`i18n keys and placeholders are in sync (${enKeys.size} keys in both en and zh)`);
  if (sourceWarnings.length > 0) {
    console.warn(`Dynamic translation calls require review (${sourceWarnings.length}):`);
    sourceWarnings.forEach((warning) => console.warn(`  - ${warning}`));
  }
  process.exit(0);
}

console.log("i18n validation failed");

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

if (placeholderMismatches.length > 0) {
  console.log(`\nPlaceholder mismatches (${placeholderMismatches.length}):`);
  placeholderMismatches.forEach((key) => console.log(`  - ${key}`));
}

if (sourceErrors.length > 0) {
  console.log(`\nInvalid source translation calls (${sourceErrors.length}):`);
  sourceErrors.forEach((error) => console.log(`  - ${error}`));
}

sourceWarnings.forEach((warning) => console.warn(`  - ${warning}`));

console.log(`\nTotal: en=${enKeys.size}  zh=${zhKeys.size}`);
process.exit(1);
