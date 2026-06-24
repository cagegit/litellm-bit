import { describe, expect, it } from "vitest";
import en from "./messages/en.json";
import zh from "./messages/zh.json";

function flatten(value: unknown, prefix = ""): Map<string, string> {
  if (typeof value === "string") return new Map([[prefix, value]]);
  if (typeof value !== "object" || value === null || Array.isArray(value)) return new Map();
  return new Map(
    Object.entries(value).flatMap(([key, child]) => [...flatten(child, prefix ? `${prefix}.${key}` : key)]),
  );
}

function placeholders(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

function dottedPropertyNames(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return [...(key.includes(".") ? [path] : []), ...dottedPropertyNames(child, path)];
  });
}
describe("translation messages", () => {
  const enMessages = flatten(en);
  const zhMessages = flatten(zh);

  it("has identical English and Chinese keys", () => {
    expect([...zhMessages.keys()].sort()).toEqual([...enMessages.keys()].sort());
  });

  it("does not use dotted property names that the runtime resolver cannot traverse", () => {
    expect(dottedPropertyNames(en)).toEqual([]);
    expect(dottedPropertyNames(zh)).toEqual([]);
  });

  it("has identical placeholders for every translated message", () => {
    const mismatches = [...enMessages].flatMap(([key, message]) => {
      const translated = zhMessages.get(key);
      return translated !== undefined && placeholders(message).join() !== placeholders(translated).join() ? [key] : [];
    });
    expect(mismatches).toEqual([]);
  });

  it("preserves context required by prompt and vector store notifications", () => {
    expect(placeholders(en.prompts.versionHistoryWithEnvironment)).toEqual(["environment"]);
    expect(placeholders(zh.prompts.versionHistoryWithEnvironment)).toEqual(["environment"]);
    expect(placeholders(en.vectorStore.vectorStoreCreatedWithDocuments)).toEqual(["count"]);
    expect(placeholders(zh.vectorStore.vectorStoreCreatedWithDocuments)).toEqual(["count"]);
  });
});
