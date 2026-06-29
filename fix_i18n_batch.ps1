# Build key->namespace index
$enPath = "D:\work\litellm_fork\litellm-bit\ui\litellm-dashboard\src\i18n\messages\en.json"
$enJson = Get-Content $enPath -Raw | ConvertFrom-Json
$keyToNamespace = @{}
foreach ($prop in $enJson.PSObject.Properties) {
    $ns = $prop.Name
    foreach ($k in $prop.Value.PSObject.Properties) {
        $kn = $k.Name
        if (-not $keyToNamespace.ContainsKey($kn)) {
            $keyToNamespace[$kn] = $ns
        }
    }
}

$srcRoot = "D:\work\litellm_fork\litellm-bit\ui\litellm-dashboard\src"
$fixed = 0
$skipped = 0

# Get all tsx files with t("...") calls, excluding test files
$files = Get-ChildItem -Path $srcRoot -Recurse -Include *.tsx | Where-Object {
    $_.FullName -notmatch '\\tests\\' -and $_.Name -notmatch '\.test\.tsx$'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if (-not $content) { continue }

    # Check if file uses t("...") as a function call
    if ($content -notmatch 't\("([a-zA-Z][^"]*)"\)') { continue }

    # Check if already has useTranslations
    if ($content -match 'const\s+\{[^}]*t[^}]*\}\s*=\s*useTranslations') {
        $skipped++
        continue
    }

    # Determine namespace from first t("key") call
    $keyMatch = [regex]::Match($content, 't\("([a-zA-Z][^"]*)"\)')
    if (-not $keyMatch.Success) { continue }
    $key = $keyMatch.Groups[1].Value
    $ns = $keyToNamespace[$key]
    if (-not $ns) { $ns = "common" }

    # Check if import exists
    if ($content -notmatch 'from\s+"@/i18n"') {
        # Add import at top
        $content = "import { useTranslations } from `"@/i18n`";`r`n" + $content
    } elseif ($content -notmatch 'useTranslations') {
        # Add useTranslations to existing import
        $content = $content -replace '(import\s+\{)([^}]*)(\}\s+from\s+"@/i18n")', ('${1}${2}, useTranslations${3}')
    }

    # Find the first React component and add the hook
    # Match patterns like: const Xxx: React.FC<...> = (...) => {
    # or: export const Xxx: React.FC<...> = (...) => {
    # or: export default function Xxx(...) {

    $patterns = @(
        '(const\s+\w+\s*:\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*\{)',
        '(export\s+const\s+\w+\s*:\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*\{)',
        '(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{)'
    )

    $matched = $false
    foreach ($pat in $patterns) {
        $m = [regex]::Match($content, $pat)
        if ($m.Success) {
            $old = $m.Groups[1].Value
            $new = $old + "`r`n  const { t } = useTranslations(`"$ns`");"
            $content = $content.Replace($old, $new)
            $matched = $true
            break
        }
    }

    if (-not $matched) {
        Write-Output "SKIP: $($file.Name) - no component pattern matched"
        continue
    }

    [System.IO.File]::WriteAllText($file.FullName, $content)
    $fixed++
}

Write-Output "Fixed: $fixed, Skipped: $skipped"
