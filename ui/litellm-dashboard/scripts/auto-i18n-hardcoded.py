#!/usr/bin/env python3
"""
Batch hardcoded UI text migration helper.

This script orchestrates the existing dashboard i18n tools:
1. scan hardcoded English UI text,
2. pick affected files by hit count,
3. optionally run batch import/hook migration and text extraction,
4. optionally translate missing zh.json values with an OpenAI-compatible API.

Examples:
  python scripts/auto-i18n-hardcoded.py --source-root src/app --source-root src/components --top 20
  python scripts/auto-i18n-hardcoded.py --source-root src/components --top 10 --apply
  python scripts/auto-i18n-hardcoded.py --apply --translate --model gpt-5.4-mini
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any


DASHBOARD_ROOT = Path(__file__).resolve().parents[1]
EN_MESSAGES = DASHBOARD_ROOT / "src" / "i18n" / "messages" / "en.json"
ZH_MESSAGES = DASHBOARD_ROOT / "src" / "i18n" / "messages" / "zh.json"


def load_local_env(env_path: Path) -> None:
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def main() -> int:
    load_local_env(DASHBOARD_ROOT / ".env")

    parser = argparse.ArgumentParser(description="Batch migrate hardcoded UI text to i18n.")
    parser.add_argument("--source-root", action="append", default=[], help="Source root relative to dashboard root.")
    parser.add_argument("--top", type=int, default=20, help="Process only the top N files by finding count.")
    parser.add_argument("--file", action="append", default=[], help="Specific file relative to dashboard root.")
    parser.add_argument("--apply", action="store_true", help="Apply migration/extraction to selected files.")
    parser.add_argument(
        "--generate-missing",
        action="store_true",
        help="Generate missing namespace keys for remaining scanner findings and replace them conservatively.",
    )
    parser.add_argument("--translate", action="store_true", help="Translate missing zh keys through OpenAI-compatible API.")
    parser.add_argument("--model", default=os.getenv("I18N_TRANSLATION_MODEL", "gpt-5.4-mini"))
    parser.add_argument("--base-url", default=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"))
    parser.add_argument(
        "--api-format",
        choices=("openai", "anthropic"),
        default=os.getenv("I18N_TRANSLATION_API_FORMAT", "openai"),
        help="Translation API format. Use anthropic for DeepSeek Anthropic-compatible endpoints.",
    )
    parser.add_argument("--output", default="i18n-hardcoded-report.json", help="Report file path.")
    args = parser.parse_args()

    roots = args.source_root or [
        "src/app/(dashboard)/models-and-endpoints",
        "src/components/model_dashboard",
    ]

    findings = run_scan(roots)
    by_file = Counter(finding["file"] for finding in findings)
    selected = select_files(by_file, args.file, args.top)

    report = {
        "sourceRoots": roots,
        "totalFindings": len(findings),
        "filesWithFindings": len(by_file),
        "selectedFiles": [{"file": file, "findings": by_file[file]} for file in selected],
        "applied": False,
        "mergedKeys": 0,
        "safeReuseReplacements": 0,
        "safeReuseSkipped": 0,
        "generatedMissingReplacements": 0,
        "generatedMissingSkipped": 0,
        "translated": False,
    }

    if args.apply and selected:
        run_node_script("scripts/batch-i18n-migrate.mjs", selected)
        run_node_script("scripts/batch-i18n-extract.mjs", selected)
        report["mergedKeys"] = merge_extracted_keys()
        after_extract_findings = [finding for finding in run_scan(roots) if finding["file"] in set(selected)]
        safe_result = safe_reuse_existing_keys(after_extract_findings)
        report["safeReuseReplacements"] = safe_result["replaced"]
        report["safeReuseSkipped"] = safe_result["skipped"]
        if args.generate_missing:
            after_safe_findings = [finding for finding in run_scan(roots) if finding["file"] in set(selected)]
            generated_result = generate_missing_keys_and_replace(after_safe_findings)
            report["generatedMissingReplacements"] = generated_result["replaced"]
            report["generatedMissingSkipped"] = generated_result["skipped"]
        report["applied"] = True

    if args.translate:
        translated = translate_missing_zh(args.model, args.base_url, args.api_format)
        report["translated"] = True
        report["translatedKeys"] = translated

    output_path = Path(args.output)
    if not output_path.is_absolute():
        output_path = DASHBOARD_ROOT / output_path
    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print_summary(report, output_path)
    return 0


def run_scan(roots: list[str]) -> list[dict[str, Any]]:
    command = [resolve_executable("node"), "scripts/check-hardcoded-ui-text.mjs"]
    for root in roots:
        command.extend(["--source-root", root])

    try:
        proc = subprocess.run(
            command,
            cwd=DASHBOARD_ROOT,
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
        )
    except OSError as exc:
        raise SystemExit(f"Failed to run scanner from {DASHBOARD_ROOT}: {command!r}: {exc}") from exc
    output = proc.stdout + "\n" + proc.stderr
    findings: list[dict[str, Any]] = []

    inline_pattern = re.compile(r"^(src/[^:]+\.(?:tsx|ts|jsx|js)):(\d+):(\d+)\s+(\S+):\s+(.*)$")
    file_pattern = re.compile(r"^(src/.+\.(?:tsx|ts|jsx|js))$")
    location_pattern = re.compile(r"^(\d+):(\d+)\s+(\S+):\s+(.*)$")
    current_file: str | None = None
    for line in output.splitlines():
        inline_match = inline_pattern.match(line)
        if inline_match:
            findings.append(
                {
                    "file": inline_match.group(1),
                    "line": int(inline_match.group(2)),
                    "column": int(inline_match.group(3)),
                    "kind": inline_match.group(4),
                    "text": inline_match.group(5),
                }
            )
            continue

        file_match = file_pattern.match(line)
        if file_match:
            current_file = file_match.group(1)
            continue

        location_match = location_pattern.match(line)
        if not location_match or not current_file:
            continue

        findings.append(
            {
                "file": current_file,
                "line": int(location_match.group(1)),
                "column": int(location_match.group(2)),
                "kind": location_match.group(3),
                "text": location_match.group(4),
            }
        )

    if proc.returncode not in (0, 1):
        sys.stderr.write(output)
        raise SystemExit(proc.returncode)

    return findings


def select_files(by_file: Counter[str], explicit_files: list[str], top: int) -> list[str]:
    if explicit_files:
        return [normalize_file(file) for file in explicit_files]
    return [file for file, _ in by_file.most_common(top)]


def normalize_file(file: str) -> str:
    return file.replace("\\", "/").removeprefix("./")


def run_node_script(script: str, files: list[str]) -> None:
    command = [resolve_executable("node"), script, *files]
    try:
        subprocess.run(command, cwd=DASHBOARD_ROOT, check=True)
    except OSError as exc:
        raise SystemExit(f"Failed to run migration from {DASHBOARD_ROOT}: {command!r}: {exc}") from exc


def safe_reuse_existing_keys(findings: list[dict[str, Any]]) -> dict[str, int]:
    messages = json.loads(EN_MESSAGES.read_text(encoding="utf-8"))
    by_namespace = build_value_key_lookup(messages)
    by_file: dict[str, list[dict[str, Any]]] = {}
    replaced = 0
    skipped = 0

    for finding in findings:
        by_file.setdefault(finding["file"], []).append(finding)

    for relative_file, file_findings in by_file.items():
        path = DASHBOARD_ROOT / relative_file
        content = path.read_text(encoding="utf-8")
        namespace = find_namespace(content)
        if not namespace or namespace not in by_namespace:
            skipped += len(file_findings)
            continue

        lines = content.splitlines(keepends=True)
        namespace_lookup = by_namespace[namespace]

        for finding in sorted(file_findings, key=lambda item: (item["line"], item["column"]), reverse=True):
            text = finding["text"]
            key = namespace_lookup.get(text)
            if not key:
                skipped += 1
                continue
            line_index = finding["line"] - 1
            if line_index < 0 or line_index >= len(lines):
                skipped += 1
                continue
            line = lines[line_index]
            replacement = f'{{t("{key}")}}'

            if finding["kind"].startswith("jsx-attr:"):
                attr = finding["kind"].split(":", 1)[1]
                updated = replace_jsx_attr(line, attr, text, replacement)
            else:
                updated = replace_jsx_text(line, text, replacement)

            if updated == line:
                skipped += 1
                continue
            lines[line_index] = updated
            replaced += 1

        path.write_text("".join(lines), encoding="utf-8")

    return {"replaced": replaced, "skipped": skipped}


def generate_missing_keys_and_replace(findings: list[dict[str, Any]]) -> dict[str, int]:
    en_messages = json.loads(EN_MESSAGES.read_text(encoding="utf-8"))
    zh_messages = json.loads(ZH_MESSAGES.read_text(encoding="utf-8"))
    by_file: dict[str, list[dict[str, Any]]] = {}
    replaced = 0
    skipped = 0

    for finding in findings:
        by_file.setdefault(finding["file"], []).append(finding)

    for relative_file, file_findings in by_file.items():
        path = DASHBOARD_ROOT / relative_file
        content = path.read_text(encoding="utf-8")
        namespace = find_namespace(content)
        if not namespace:
            skipped += len(file_findings)
            continue

        en_messages.setdefault(namespace, {})
        zh_messages.setdefault(namespace, {})
        if not isinstance(en_messages[namespace], dict) or not isinstance(zh_messages[namespace], dict):
            skipped += len(file_findings)
            continue

        lines = content.splitlines(keepends=True)
        namespace_keys = en_messages[namespace]

        for finding in sorted(file_findings, key=lambda item: (item["line"], item["column"]), reverse=True):
            text = normalize_ui_text(finding["text"])
            if not should_generate_key_for_text(text):
                skipped += 1
                continue

            key = existing_key_for_text(namespace_keys, text) or unique_key(namespace_keys, text)
            if not key:
                skipped += 1
                continue

            line_index = finding["line"] - 1
            if line_index < 0 or line_index >= len(lines):
                skipped += 1
                continue

            replacement = f'{{t("{key}")}}'
            line = lines[line_index]
            if finding["kind"].startswith("jsx-attr:"):
                attr = finding["kind"].split(":", 1)[1]
                updated = replace_jsx_attr(line, attr, finding["text"], replacement)
            else:
                updated = replace_jsx_text(line, finding["text"], replacement)

            if updated == line:
                skipped += 1
                continue

            lines[line_index] = updated
            if key not in namespace_keys:
                namespace_keys[key] = text
            if key not in zh_messages[namespace]:
                zh_messages[namespace][key] = text
            replaced += 1

        path.write_text("".join(lines), encoding="utf-8")

    EN_MESSAGES.write_text(json.dumps(en_messages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ZH_MESSAGES.write_text(json.dumps(zh_messages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"replaced": replaced, "skipped": skipped}


def normalize_ui_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def should_generate_key_for_text(text: str) -> bool:
    if len(text) < 2 or len(text) > 180:
        return False
    if not re.search(r"[A-Za-z]", text):
        return False
    if re.search(r"[{}<>]", text):
        return False
    if re.match(r"^[a-z_][a-z0-9_]*$", text):
        return False
    if re.match(r"^[A-Z0-9_:-]+$", text):
        return False
    return True


def existing_key_for_text(namespace_keys: dict[str, Any], text: str) -> str | None:
    for key, value in namespace_keys.items():
        if value == text:
            return key
    return None


def unique_key(namespace_keys: dict[str, Any], text: str) -> str | None:
    base = to_camel_case(text)
    base = re.sub(r"[^a-zA-Z0-9]", "", base)
    if not base:
        return None
    if not re.match(r"^[a-zA-Z]", base):
        base = f"text{base}"
    key = base[:80]
    candidate = key
    counter = 1
    while candidate in namespace_keys:
        if namespace_keys[candidate] == text:
            return candidate
        candidate = f"{key}{counter}"
        counter += 1
    return candidate


def to_camel_case(text: str) -> str:
    words = re.findall(r"[A-Za-z0-9]+", text.replace("LiteLLM", "Litellm"))
    if not words:
        return ""
    first, *rest = words
    return first[:1].lower() + first[1:] + "".join(word[:1].upper() + word[1:] for word in rest)


def merge_extracted_keys() -> int:
    extracted_path = DASHBOARD_ROOT / "scripts" / "extracted-keys.json"
    if not extracted_path.exists():
        return 0

    extracted = json.loads(extracted_path.read_text(encoding="utf-8"))
    added = 0
    for message_file in (EN_MESSAGES, ZH_MESSAGES):
        messages = json.loads(message_file.read_text(encoding="utf-8"))
        file_added = 0
        for namespace, keys in extracted.items():
            if not isinstance(keys, dict):
                continue
            messages.setdefault(namespace, {})
            if not isinstance(messages[namespace], dict):
                continue
            for key, value in keys.items():
                if key not in messages[namespace]:
                    messages[namespace][key] = value
                    file_added += 1
        if file_added:
            message_file.write_text(json.dumps(messages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        added += file_added
    return added


def build_value_key_lookup(messages: dict[str, Any]) -> dict[str, dict[str, str]]:
    lookups: dict[str, dict[str, str]] = {}
    for namespace, values in messages.items():
        if not isinstance(values, dict):
            continue
        lookup: dict[str, str] = {}
        collect_leaf_values(values, lookup)
        lookups[namespace] = lookup
    return lookups


def collect_leaf_values(values: dict[str, Any], lookup: dict[str, str], prefix: str = "") -> None:
    for key, value in values.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            collect_leaf_values(value, lookup, path)
        elif isinstance(value, str) and value not in lookup:
            lookup[value] = path


def find_namespace(content: str) -> str | None:
    match = re.search(r'useTranslations\(["\']([^"\']+)["\']\)', content)
    return match.group(1) if match else None


def replace_jsx_attr(line: str, attr: str, text: str, replacement: str) -> str:
    escaped = re.escape(text)
    patterns = [
        (rf'({re.escape(attr)}=)"{escaped}"', rf"\1{replacement}"),
        (rf"({re.escape(attr)}=)'{escaped}'", rf"\1{replacement}"),
        (rf'({re.escape(attr)}=)\{{"{escaped}"\}}', rf"\1{replacement}"),
        (rf"({re.escape(attr)}=)\{{'{escaped}'\}}", rf"\1{replacement}"),
    ]
    for pattern, repl in patterns:
        updated = re.sub(pattern, repl, line, count=1)
        if updated != line:
            return updated
    return line


def replace_jsx_text(line: str, text: str, replacement: str) -> str:
    if text not in line:
        return line
    return line.replace(text, replacement, 1)


def resolve_executable(name: str) -> str:
    executable = shutil.which(name)
    if executable:
        return executable
    if os.name == "nt":
        executable = shutil.which(f"{name}.cmd") or shutil.which(f"{name}.exe")
        if executable:
            return executable
    raise SystemExit(f"Required executable not found on PATH: {name}")


def translate_missing_zh(model: str, base_url: str, api_format: str) -> list[str]:
    api_key = translation_api_key(api_format)
    if not api_key:
        env_names = "DEEPSEEK_API_KEY or ANTHROPIC_API_KEY" if api_format == "anthropic" else "OPENAI_API_KEY"
        raise SystemExit(f"{env_names} is required when --translate is set.")

    en = json.loads(EN_MESSAGES.read_text(encoding="utf-8"))
    zh = json.loads(ZH_MESSAGES.read_text(encoding="utf-8"))
    missing = missing_or_fallback_leaf_values(en, zh)

    translated_paths: list[str] = []
    for batch in chunked(missing, 40):
        translations = request_translations(batch, api_key, model, base_url, api_format)
        for path, value in translations.items():
            set_nested(zh, path.split("."), value)
            translated_paths.append(path)

    if translated_paths:
        ZH_MESSAGES.write_text(json.dumps(zh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return translated_paths


def translation_api_key(api_format: str) -> str | None:
    if api_format == "anthropic":
        return os.getenv("DEEPSEEK_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    return os.getenv("OPENAI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")


def missing_or_fallback_leaf_values(en: dict[str, Any], zh: dict[str, Any], prefix: str = "") -> dict[str, str]:
    missing: dict[str, str] = {}
    for key, value in en.items():
        path = f"{prefix}.{key}" if prefix else key
        zh_value = zh.get(key) if isinstance(zh, dict) else None
        if isinstance(value, dict):
            missing.update(missing_or_fallback_leaf_values(value, zh_value if isinstance(zh_value, dict) else {}, path))
        elif isinstance(value, str) and (not isinstance(zh_value, str) or zh_value == value):
            missing[path] = value
    return missing


def request_translations(
    items: dict[str, str],
    api_key: str,
    model: str,
    base_url: str,
    api_format: str,
) -> dict[str, str]:
    if api_format == "anthropic":
        return request_anthropic_translations(items, api_key, model, base_url)
    return request_openai_translations(items, api_key, model, base_url)


def request_openai_translations(items: dict[str, str], api_key: str, model: str, base_url: str) -> dict[str, str]:
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Translate dashboard UI strings from English to Simplified Chinese. "
                    "Keep product names, code identifiers, API names, placeholders in braces, and acronyms unchanged. "
                    "Return strict JSON object mapping each input key to the translated string."
                ),
            },
            {"role": "user", "content": json.dumps(items, ensure_ascii=False)},
        ],
        "response_format": {"type": "json_object"},
    }
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        raise SystemExit(f"Translation request failed: {exc}") from exc

    content = body["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    return {key: str(value) for key, value in parsed.items() if key in items}


def request_anthropic_translations(items: dict[str, str], api_key: str, model: str, base_url: str) -> dict[str, str]:
    payload = {
        "model": model,
        "max_tokens": 4096,
        "system": (
            "Translate dashboard UI strings from English to Simplified Chinese. "
            "Keep product names, code identifiers, API names, placeholders in braces, and acronyms unchanged. "
            "Return only a strict JSON object mapping each input key to the translated string."
        ),
        "messages": [
            {
                "role": "user",
                "content": json.dumps(items, ensure_ascii=False),
            }
        ],
    }
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}/v1/messages",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        raise SystemExit(f"Translation request failed: {exc}") from exc

    content_blocks = body.get("content", [])
    content = "".join(block.get("text", "") for block in content_blocks if block.get("type") == "text")
    parsed = json.loads(extract_json_object(content))
    return {key: str(value) for key, value in parsed.items() if key in items}


def extract_json_object(content: str) -> str:
    stripped = content.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?\s*", "", stripped)
        stripped = re.sub(r"\s*```$", "", stripped)
    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise SystemExit("Translation response did not contain a JSON object.")
    return stripped[start : end + 1]


def set_nested(target: dict[str, Any], path: list[str], value: str) -> None:
    current = target
    for key in path[:-1]:
        current = current.setdefault(key, {})
    current[path[-1]] = value


def chunked(items: dict[str, str], size: int) -> list[dict[str, str]]:
    pairs = list(items.items())
    return [dict(pairs[index : index + size]) for index in range(0, len(pairs), size)]


def print_summary(report: dict[str, Any], output_path: Path) -> None:
    print(f"Findings: {report['totalFindings']} across {report['filesWithFindings']} files")
    print(f"Selected files: {len(report['selectedFiles'])}")
    for item in report["selectedFiles"][:20]:
        print(f"{item['findings']:>4}  {item['file']}")
    print(f"Report: {output_path}")


if __name__ == "__main__":
    raise SystemExit(main())
