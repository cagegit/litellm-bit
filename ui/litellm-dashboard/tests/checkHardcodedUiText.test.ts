import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = join(__dirname, "..", "scripts", "check-hardcoded-ui-text.mjs");

describe("check-hardcoded-ui-text", () => {
  it("flags hardcoded English UI text in JSX text and attributes", () => {
    const tempRoot = join(tmpdir(), `hardcoded-ui-text-${Date.now()}`);
    const sourceRoot = join(tempRoot, "src", "app", "(dashboard)", "models-and-endpoints");
    mkdirSync(sourceRoot, { recursive: true });

    try {
      writeFileSync(
        join(sourceRoot, "Demo.tsx"),
        [
          'import { useTranslations } from "@/i18n";',
          "",
          "export default function Demo() {",
          '  const { t } = useTranslations("models");',
          "",
          "  return (",
          "    <div>",
          "      <span>Hardcoded English</span>",
          '      <button title="Reload Price Data">{t("addModel")}</button>',
          "    </div>",
          "  );",
          "}",
          "",
        ].join("\n"),
      );

      const result = spawnSync("node", [scriptPath, "--source-root", sourceRoot], {
        encoding: "utf8",
      });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain("Hardcoded English");
      expect(result.stdout).toContain("Reload Price Data");
      expect(result.stdout).toContain("Found 2 hardcoded English UI strings");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
