#!/usr/bin/env node
/**
 * Batch i18n phase 1: import + hook injection only.
 * Usage: node scripts/batch-i18n-migrate.mjs [files...]
 *
 * For each file:
 * 1. Adds `import { useTranslations } from "@/i18n"` after last complete import
 * 2. Injects `const { t } = useTranslations("namespace")` in component body
 */
import fs from "fs";
import path from "path";

const I18N_IMPORT = `import { useTranslations } from "@/i18n";`;

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node scripts/batch-i18n-migrate.mjs [files...]");
    process.exit(1);
  }

  let success = 0, fail = 0, skip = 0;

  for (const file of files) {
    try {
      const result = migrateFile(file);
      if (result === "skip") skip++;
      else success++;
    } catch (e) {
      console.error(`  FAIL ${file}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${success} migrated, ${skip} skipped, ${fail} failed`);
}

function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Skip if already has i18n import (any quote style)
  if (content.includes('useTranslations } from "@/i18n"') || content.includes("useTranslations } from '@/i18n'")) return "skip";

  const ns = detectNamespace(filePath);
  if (!ns) return "skip";

  const lines = content.split("\n");

// Skip if import already present (double-check against all variants)
if (content.includes(I18N_IMPORT) || content.includes("import { useTranslations } from '@/i18n'") || content.includes('useTranslations } from "@/i18n"') || content.includes("useTranslations } from '@/i18n'")) {
  result = content; // keep original
  console.log(`  SKIP ${path.relative("src/components", filePath)} [${ns}] (already has import)`);
  return "skip";
}

// Find last complete import statement

  // Find last complete import statement (find last line ending with ; or " or ')
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) {
      // Check if this import STATEMENT ends on this line
      const trimmed = lines[i].trimEnd();
      if (trimmed.endsWith(";") || trimmed.endsWith('"') || trimmed.endsWith("'")) {
        // Single-line import
        lastImportLine = i;
      } else {
        // Multi-line import - scan forward for completion
        for (let j = i + 1; j < lines.length; j++) {
          const t = lines[j].trimEnd();
          if (t.endsWith(";") || t.endsWith('"') || t.endsWith("'")) {
            lastImportLine = j;
            i = j; // skip ahead
            break;
          }
        }
      }
    }
  }

  if (lastImportLine >= 0) {
    lines.splice(lastImportLine + 1, 0, I18N_IMPORT);
  } else {
    // No imports found, add at top after any directives like "use client"
    let insertAt = 0;
    for (const line of lines) {
      if (line.startsWith('"use ') || line.startsWith("'use ") || line.trim() === "") {
        insertAt++;
      } else break;
    }
    lines.splice(insertAt, 0, I18N_IMPORT);
  }

  let result = lines.join("\n");
  result = injectHook(result, ns);

  fs.writeFileSync(filePath, result, "utf-8");
  console.log(`  OK  ${path.relative("src/components", filePath)} [${ns}]`);
  return "ok";
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
    "budgets": "billing",
    "UsagePage": "billing",
    "aiHub": "aiHub",
    "DeletedKeysPage": "deletedKeys", "DeletedTeamsPage": "deletedTeams",
    "MemoryView": "memoryView", "CloudZeroCostTracking": "cloudZero",
    "CostTrackingSettings": "billing", "EntityUsageExport": "billing",
    "VirtualKeysPage": "keys",
    "GuardrailsMonitor": "settings", "cache_settings": "settings",
    "ToolPolicies": "settings", "ToolPoliciesView": "settings",
    "SearchTools": "mcp",
    "LanguageSwitcher": "layout",
    "edit_auto_router": "settings",
    "key_team_helpers": "users",
    "molecules/models": "models",
    "survey": "survey", "templates": "settings", "workflow_runs": "logs",
  };

  if (nsMap[baseName]) return nsMap[baseName];
  if (nsMap[dir]) return nsMap[dir];
  if (nsMap[path.dirname(dir)]) return nsMap[path.dirname(dir)];
  return "common";
}

function injectHook(content, ns) {
  // Skip if hook already exists
  if (content.includes('const { t } = useTranslations')) return content;

  const hookCode = `\n  const { t } = useTranslations("${ns}");\n`;

  const patterns = [
    // export const ComponentName: React.FC<...> = (...) => {
    /(export\s+(?:const|function)\s+\w+\s*:\s*React\.FC[^>]*>\s*=\s*(?:\{[^}]*\})?\s*(?:\([^)]*\))?\s*(?::\s*\w+)?\s*=>\s*\{)/,
    // export function ComponentName(...) {
    /(export\s+function\s+\w+\s*\([^)]*\)\s*\{)/,
    // const ComponentName: React.FC<...> = (...) => {
    /(const\s+[A-Z]\w+\s*:\s*React\.FC[^>]*>\s*=\s*(?:\{[^}]*\})?\s*(?:\([^)]*\))?\s*(?::\s*\w+)?\s*=>\s*\{)/,
    // export const ComponentName = (...) => { (uppercase = component)
    /(export\s+const\s+[A-Z]\w+\s*=\s*(?:\{[^}]*\})?\s*(?:\([^)]*\))?\s*(?::\s*\w+)?\s*=>\s*\{)/,
    // export default function ComponentName(
    /(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{)/,
  ];

  for (const pat of patterns) {
    const m = content.match(pat);
    if (m) {
      const pos = m.index + m[0].length;
      return content.slice(0, pos) + hookCode + content.slice(pos);
    }
  }

  // Fallback: look for first useState/useRef call after component declaration
  const hookCall = content.match(/(?:\n\s*)(?:const|let)\s+\w+\s*=\s*use(?:State|Ref|Effect|Memo|Callback)\(/);
  if (hookCall) {
    const pos = hookCall.index;
    return content.slice(0, pos) + hookCode + content.slice(pos);
  }

  console.warn(`  WARN: could not inject hook`);
  return content;
}

main();
