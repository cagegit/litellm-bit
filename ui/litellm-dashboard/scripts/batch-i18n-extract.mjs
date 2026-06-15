#!/usr/bin/env node
/**
 * Batch i18n phase 2: string extraction + replacement.
 * Usage: node scripts/batch-i18n-extract.mjs [files...]
 *
 * For each file:
 * 1. Finds hardcoded UI strings
 * 2. Replaces with {t("ns.key")} calls
 * 3. Collects (ns, key, english) tuples
 * 4. Outputs extracted keys JSON for translation
 *
 * Requires phase 1 (import+hook) to already be done.
 */
import fs from "fs";
import path from "path";

const OUTPUT = "scripts/extracted-keys.json";
const COLLECTED = {};

// Known UI strings -> key overrides (from en.json)
const KNOWN_KEYS = {};
try {
  const enJson = JSON.parse(fs.readFileSync("src/i18n/messages/en.json", "utf-8"));
  function flattenKeys(obj, prefix = "") {
    for (const [k, v] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") {
        KNOWN_KEYS[v] = fullKey;
      } else if (typeof v === "object" && v !== null) {
        flattenKeys(v, fullKey);
      }
    }
  }
  flattenKeys(enJson);
} catch (e) { /* proceed without known keys */ }

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node scripts/batch-i18n-extract.mjs [files...]");
    process.exit(1);
  }

  try {
    const existing = JSON.parse(fs.readFileSync(OUTPUT, "utf-8"));
    Object.assign(COLLECTED, existing);
  } catch (e) { /* new file */ }

  let totalReplaced = 0, totalFiles = 0;

  for (const file of files) {
    const result = processFile(file);
    if (result > 0) {
      totalFiles++;
      totalReplaced += result;
    }
  }

  // Write collected keys with sorted ns + keys
  const ordered = {};
  for (const ns of Object.keys(COLLECTED).sort()) {
    ordered[ns] = {};
    for (const key of Object.keys(COLLECTED[ns]).sort()) {
      ordered[ns][key] = COLLECTED[ns][key];
    }
  }
  fs.writeFileSync(OUTPUT, JSON.stringify(ordered, null, 2), "utf-8");

  console.log(`\nDone: ${totalReplaced} replacements in ${totalFiles} files`);
  console.log(`Keys extracted to ${OUTPUT}`);
  for (const ns of Object.keys(ordered).sort()) {
    console.log(`  ${ns}: ${Object.keys(ordered[ns]).length} keys`);
  }
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ns = detectNamespace(filePath);
  if (!ns) return 0;

  // SAFETY: only extract strings if hook is declared in this file
  if (!content.includes('const { t } = useTranslations')) {
    // File might have import but hook in wrong place or missing
    return 0;
  }

  const usedKeys = COLLECTED[ns] || {};
  let fileKeys = {};
  let replacements = 0;
  let result = content;

  // Pattern 1: JSX text content between tags: >Text<
  const jsxTextRe = /(?<=>)([A-Z][A-Za-z0-9\s\-_!?,.'"()]+)(?=\s*<)/g;
  let match;
  while ((match = jsxTextRe.exec(result)) !== null) {
    const text = match[1].trim();
    if (isUIText(text)) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        const before = result.slice(0, match.index);
        const after = result.slice(match.index + match[0].length);
        if (!before.endsWith("{t(") && !after.startsWith("{t(")) {
          result = before + `{t("${ns}.${key}")}` + after;
          replacements++;
        }
      }
    }
  }

  // Pattern 2: String literals in component props
  const propStrRe = /(title|placeholder|label|tooltip|confirmText|cancelText|okText|description|helpText|header|subTitle|footerText)=["']([A-Z][A-Za-z0-9\s\-_!?,.'"()]{2,})["']/g;
  while ((match = propStrRe.exec(result)) !== null) {
    const text = match[2].trim();
    if (isUIText(text) && text.length > 1) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        result = result.replace(`${match[1]}="${text}"`, `${match[1]}={t("${ns}.${key}")}`);
        replacements++;
      }
    }
  }

  // Pattern 3: message/description in notification/alert calls
  const msgStrRe = /(message|description):\s*["']([A-Za-z0-9\s\-_!?,.'"()]{3,})["']/g;
  while ((match = msgStrRe.exec(result)) !== null) {
    const text = match[2].trim();
    if (isUIText(text) && text.length > 2) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        result = result.replace(`${match[1]}: "${text}"`, `${match[1]}: t("${ns}.${key}")`);
        replacements++;
      }
    }
  }

  // Pattern 4: aria-label="String"
  const ariaLabelRe = /(aria-label)=["']([A-Z][A-Za-z0-9\s\-_!?,.'"()]{2,})["']/g;
  while ((match = ariaLabelRe.exec(result)) !== null) {
    const text = match[2].trim();
    if (isUIText(text) && text.length > 1) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        result = result.replace(`${match[1]}="${text}"`, `${match[1]}={t("${ns}.${key}")}`);
        replacements++;
      }
    }
  }

  // Pattern 5: Tooltip title="String"
  const tooltipTitleRe = /Tooltip\s+title=["']([A-Z][A-Za-z0-9\s\-_!?,.'"()]{3,})["']/g;
  while ((match = tooltipTitleRe.exec(result)) !== null) {
    const text = match[1].trim();
    if (isUIText(text)) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        result = result.replace(`Tooltip title="${text}"`, `Tooltip title={t("${ns}.${key}")}`);
        replacements++;
      }
    }
  }

  // Pattern 6: Template literals without interpolation (pure text backticks)
  const templateLitRe = /`([A-Z][A-Za-z0-9\s\-_!?,.'"()]{3,})`/g;
  while ((match = templateLitRe.exec(result)) !== null) {
    const text = match[1].trim();
    // Only replace if no ${} interpolation inside
    if (isUIText(text) && !text.includes('${')) {
      const key = getOrCreateKey(ns, text, usedKeys, fileKeys);
      if (key) {
        result = result.replace(`\`${text}\``, `{t("${ns}.${key}")}`);
        replacements++;
      }
    }
  }

  if (replacements > 0) {
    if (!COLLECTED[ns]) COLLECTED[ns] = {};
    for (const [k, v] of Object.entries(fileKeys)) {
      COLLECTED[ns][k] = v;
    }
    fs.writeFileSync(filePath, result, "utf-8");
    console.log(`  OK  ${path.relative("src/components", filePath)} [${ns}] +${replacements}`);
  } else {
    console.log(`  --  ${path.relative("src/components", filePath)} [${ns}] no UI strings`);
  }

  return replacements;
}

function isUIText(text) {
  if (text.length < 2 || text.length > 80) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[a-z_][a-z0-9_]*$/.test(text)) return false; // code identifiers
  if (text.includes("{") || text.includes("}")) return false;
  if (text.includes("=") || text.includes("=>")) return false;
  if (!/^[A-Za-z0-9]/.test(text)) return false;
  if (/^[\d\s,.%]+$/.test(text)) return false;
  return true;
}

function toCamelCase(str) {
  return str
    .replace(/['"]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function getOrCreateKey(ns, text, usedKeys, fileKeys) {
  if (KNOWN_KEYS[text]) {
    const knownKey = KNOWN_KEYS[text];
    const [knownNs, ...keyParts] = knownKey.split(".");
    const keyOnly = keyParts.join(".");
    if (knownNs === ns || knownNs === "common") {
      fileKeys[keyOnly] = text;
      return keyOnly;
    }
  }
  let key = toCamelCase(text).replace(/[^a-zA-Z0-9]/g, "");
  if (!key || key.length < 2) return null;
  let dedupKey = key;
  let counter = 1;
  const allKeys = { ...usedKeys, ...fileKeys };
  while (allKeys[dedupKey]) {
    if (allKeys[dedupKey] === text) return dedupKey;
    dedupKey = key + counter;
    counter++;
  }
  fileKeys[dedupKey] = text;
  return dedupKey;
}

function detectNamespace(filePath) {
  const relPath = filePath.replace(/^src\/components\//, "");
  const dir = path.dirname(relPath);
  const baseName = path.basename(filePath, ".tsx");

  const nsMap = {
    "playground": "playground", "playground/chat_ui": "playground", "playground/llm_calls": "playground",
    "prompts": "prompts", "prompts/prompt_editor_view": "prompts",
    "agents": "agents", "agent_management": "agents",
    "mcp_tools": "mcp", "mcp_server_management": "mcp",
    "view_logs": "logs", "view_logs/ToolsSection": "logs", "view_logs/LogDetailsDrawer": "logs", "view_logs/GuardrailViewer": "logs",
    "guardrails": "settings", "guardrails/content_filter": "settings", "guardrails/llm_judge": "settings",
    "guardrails/custom_code": "settings", "guardrails/tool_permission": "settings",
    "Settings": "settings", "Settings/AdminSettings": "settings",
    "users": "users", "view_users": "users",
    "team": "team", "organization": "organization", "permissions": "permissions",
    "model_dashboard": "models", "view_model": "models", "add_model": "models",
    "chat": "chat",
    "vector_store_management": "vectorStore", "tag_management": "tagManagement",
    "claude_code_plugins": "claudeCodePlugins",
    "common_components": "common", "ui": "common", "atoms": "common", "shared": "common", "molecules": "common",
    "policies": "settings", "router_settings": "settings", "routing_groups": "settings",
    "budgets": "billing", "UsagePage": "billing",
    "aiHub": "aiHub",
    "DeletedKeysPage": "deletedKeys", "DeletedTeamsPage": "deletedTeams",
    "MemoryView": "memoryView", "CloudZeroCostTracking": "cloudZero",
    "CostTrackingSettings": "billing", "EntityUsageExport": "billing",
    "VirtualKeysPage": "keys",
    "GuardrailsMonitor": "settings", "cache_settings": "settings",
    "ToolPolicies": "settings", "ToolPoliciesView": "settings",
    "SearchTools": "mcp", "LanguageSwitcher": "layout",
    "edit_auto_router": "settings", "key_team_helpers": "users",
    "molecules/models": "models", "survey": "survey", "templates": "settings", "workflow_runs": "logs",
  };

  if (nsMap[baseName]) return nsMap[baseName];
  if (nsMap[dir]) return nsMap[dir];
  if (nsMap[path.dirname(dir)]) return nsMap[path.dirname(dir)];
  return "common";
}

main();
