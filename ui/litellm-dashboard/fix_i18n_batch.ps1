$ErrorActionPreference = "Stop"

# Read en.json to build a reverse index: key -> namespace
$enJson = Get-Content "D:\work\litellm_fork\litellm-bit\ui\litellm-dashboard\src\i18n\messages\en.json" -Raw | ConvertFrom-Json
$keyToNamespace = @{}
foreach ($prop in $enJson.PSObject.Properties) {
    $ns = $prop.Name
    $keys = $prop.Value
    foreach ($k in $keys.PSObject.Properties) {
        $kn = $k.Name
        if (-not $keyToNamespace.ContainsKey($kn)) {
            $keyToNamespace[$kn] = $ns
        }
    }
}

# Find files with t("...") but without useTranslations
$files = rg -l 't\("[a-zA-Z]' "D:\work\litellm_fork\litellm-bit\ui\litellm-dashboard\src" -g '*.tsx' -g '!*.test.*' -g '!*.test.tsx'

$fixed = 0
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f)

    # Check if already has useTranslations
    if ($content -match 'const\s+\{\s*t\s*\}?\s*=\s*useTranslations') {
        continue
    }

    # Skip if doesn't import useTranslations
    if ($content -notmatch 'import\s+\{[^}]*useTranslations[^}]*\}\s+from\s+"@/i18n"') {
        # Add import
        if ($content -match "import.*from\s+`"@/i18n`"") {
            # Already has some i18n import, just add useTranslations
            $content = $content -replace 'import\s+\{([^}]*)\}\s+from\s+"@/i18n"', 'import {${1}, useTranslations} from "@/i18n"'
        } else {
            # Need to add the import
            $content = "import { useTranslations } from `"@/i18n`";`r`n" + $content
        }
    }

    # Determine namespace from first t("...") key
    $match = [regex]::Match($content, 't\("([a-zA-Z][^"]*)"\)')
    if (-not $match.Success) { continue }
    $key = $match.Groups[1].Value
    $ns = $keyToNamespace[$key]
    if (-not $ns) { $ns = "common" }

    # Find component function and add hook
    # Pattern: (export )?const/function Name =/Name( ... ) => {
    if ($content -match '(const\s+\w+\s*[:=]\s*.*?\)\s*=>\s*\{)') {
        $firstBrace = $matches[1]
        $replacement = $firstBrace + "`r`n  const { t } = useTranslations(`"$ns`");"
        $content = $content.Replace($firstBrace, $replacement)
        $fixed++
    }

    [System.IO.File]::WriteAllText($f, $content)
}

Write-Output "Fixed $fixed files"
