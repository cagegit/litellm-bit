import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const extractor = resolve("scripts/batch-i18n-extract.mjs");

describe("batch-i18n-extract", () => {
  it("writes local keys for files using a namespaced translation hook", () => {
    const root = mkdtempSync(join(tmpdir(), "i18n-extractor-"));
    try {
      mkdirSync(join(root, "scripts"));
      mkdirSync(join(root, "src", "i18n", "messages"), { recursive: true });
      mkdirSync(join(root, "src", "components", "model_dashboard"), { recursive: true });
      writeFileSync(join(root, "scripts", "extracted-keys.json"), "{}");
      writeFileSync(
        join(root, "src", "i18n", "messages", "en.json"),
        JSON.stringify({ models: { modelManagement: "Model Management" } }),
      );
      const fixturePath = join(root, "src", "components", "model_dashboard", "Fixture.tsx");
      writeFileSync(
        fixturePath,
        [
          'import { useTranslations } from "@/i18n";',
          "export function Fixture() {",
          '  const { t } = useTranslations("models");',
          "  return <h1>Model Management</h1>;",
          "}",
        ].join("\n"),
      );

      const result = spawnSync(process.execPath, [extractor, fixturePath], { cwd: root, encoding: "utf8" });

      expect(result.status).toBe(0);
      expect(readFileSync(fixturePath, "utf8")).toContain('{t("modelManagement")}');
      expect(readFileSync(fixturePath, "utf8")).not.toContain('{t("models.modelManagement")}');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
