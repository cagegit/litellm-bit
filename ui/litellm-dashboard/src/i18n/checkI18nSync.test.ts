import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const checker = resolve("scripts/check-i18n-sync.mjs");
function runChecker(en: object, zh: object, source: string) {
  const root = mkdtempSync(join(tmpdir(), "i18n-checker-"));
  try {
    const messages = join(root, "messages");
    const sources = join(root, "src");
    mkdirSync(messages);
    mkdirSync(sources);
    writeFileSync(join(messages, "en.json"), JSON.stringify(en));
    writeFileSync(join(messages, "zh.json"), JSON.stringify(zh));
    writeFileSync(join(sources, "fixture.tsx"), source);
    return spawnSync(process.execPath, [checker, "--messages-dir", messages, "--source-root", sources], {
      encoding: "utf8",
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("check-i18n-sync", () => {
  it("rejects literal translation keys missing from the catalog", () => {
    const result = runChecker(
      { common: { known: "Known" } },
      { common: { known: "已知" } },
      'const { t } = useTranslations("common"); t("missing");',
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("missing translation key 'common.missing'");
  });

  it("rejects keys that repeat their useTranslations namespace", () => {
    const result = runChecker(
      { common: { known: "Known" } },
      { common: { known: "已知" } },
      'const { t } = useTranslations("common"); t("common.known");',
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("duplicates namespace 'common'");
  });

  it("warns without failing for dynamic translation calls", () => {
    const result = runChecker(
      { common: { known: "Known" } },
      { common: { known: "已知" } },
      'const { t } = useTranslations("common"); t(key);',
    );
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("dynamic translation call t(key)");
  });

  it("rejects placeholder mismatches between locales", () => {
    const result = runChecker({ common: { greeting: "Hello {name}" } }, { common: { greeting: "你好 {user}" } }, "");
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Placeholder mismatches (1)");
    expect(result.stdout).toContain("common.greeting");
  });
});
