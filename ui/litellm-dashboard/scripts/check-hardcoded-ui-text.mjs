#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import * as ts from "typescript";

const defaultRoots = [
  join(process.cwd(), "src", "app", "(dashboard)", "models-and-endpoints"),
  join(process.cwd(), "src", "components", "model_dashboard"),
];

const getArgumentValues = (name) => {
  const values = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] === name && process.argv[index + 1]) {
      values.push(process.argv[index + 1]);
    }
  }
  return values;
};

const sourceRoots = getArgumentValues("--source-root");
const roots = sourceRoots.length > 0 ? sourceRoots : defaultRoots;

const jsxAttributeNames = new Set([
  "alt",
  "aria-label",
  "buttonText",
  "confirmText",
  "description",
  "footerText",
  "header",
  "helpText",
  "label",
  "okText",
  "placeholder",
  "subTitle",
  "subtitle",
  "tab",
  "title",
  "tooltip",
  "tooltipTitle",
  "message",
]);

const sourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (![".ts", ".tsx", ".js", ".jsx"].includes(extname(entry.name))) return [];
    if (entry.name.includes(".test.") || entry.name.includes(".spec.") || entry.name.includes(".stories.")) return [];
    return [path];
  });

const findings = roots.flatMap((root) => sourceFiles(root).flatMap(scanFile));

if (findings.length === 0) {
  console.log(`No hardcoded English UI text found in ${roots.map((root) => relative(process.cwd(), root)).join(", ")}`);
  process.exit(0);
}

for (const finding of findings) {
  console.log(`${finding.file}:${finding.line}:${finding.column} ${finding.kind}: ${finding.text}`);
}

console.log(`\nFound ${findings.length} hardcoded English UI string${findings.length === 1 ? "" : "s"}`);
process.exit(1);

function scanFile(filePath) {
  const source = readFileSync(filePath, "utf8");
  const scriptKind =
    extname(filePath) === ".tsx" || extname(filePath) === ".jsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, scriptKind);
  const findings = [];

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = normalizeWhitespace(node.getText(sourceFile));
      if (looksLikeUiText(text)) {
        findings.push(formatFinding(filePath, sourceFile, node, "jsx-text", text));
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const attrName = getJsxAttributeName(node);
      if (attrName && jsxAttributeNames.has(attrName) && looksLikeUiText(node.text)) {
        findings.push(formatFinding(filePath, sourceFile, node, `jsx-attr:${attrName}`, node.text));
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return findings;
}

function getJsxAttributeName(node) {
  const parent = node.parent;
  if (!parent) return null;
  if (ts.isJsxAttribute(parent)) return parent.name.getText();
  if (ts.isJsxExpression(parent) && parent.parent && ts.isJsxAttribute(parent.parent)) return parent.parent.name.getText();
  return null;
}

function formatFinding(filePath, sourceFile, node, kind, text) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return {
    file: relative(process.cwd(), filePath).replace(/\\/g, "/"),
    line: location.line + 1,
    column: location.character + 1,
    kind,
    text,
  };
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function looksLikeUiText(text) {
  const normalized = normalizeWhitespace(text);
  if (normalized.length < 3 || normalized.length > 160) return false;
  if (!/[A-Za-z]/.test(normalized)) return false;
  if (/[{}<>`]/.test(normalized)) return false;
  if (normalized.includes("=>") || normalized.includes("${")) return false;
  if (/(https?:\/\/|mailto:|\/|\\)/.test(normalized)) return false;
  if (/^[a-z_][a-z0-9_]*$/.test(normalized)) return false;
  if (/^[A-Z0-9_:-]+$/.test(normalized)) return false;
  if (/^[\d\s.,%+-]+$/.test(normalized)) return false;
  if (normalized.includes(" ")) return true;
  return /^[A-Z][a-z]+$/.test(normalized) || /^[a-z]+$/.test(normalized);
}
