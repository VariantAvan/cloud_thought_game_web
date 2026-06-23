# Backup script — commits and pushes if there are changes.
# Usage: .\scripts\backup.ps1
# Schedule via Windows Task Scheduler for regular GitHub backups.
#
# Bumps Version No. in content/credits.md (and package.json) before each backup commit.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Update-BackupVersion {
    $creditsPath = Join-Path $Root "content\credits.md"
    $packagePath = Join-Path $Root "package.json"

    $content = Get-Content $creditsPath -Raw -Encoding UTF8
    if ($content -notmatch '(?<=## Version No\.\r?\n\r?\n)(\d+)\.(\d+)\.(\d+)') {
        Write-Warning "Could not find version in content/credits.md"
        return $null
    }

    $major = [int]$Matches[1]
    $minor = [int]$Matches[2]
    $patch = [int]$Matches[3] + 1
    $newVersion = "$major.$minor.$patch"

    $content = [regex]::Replace(
        $content,
        '(?<=## Version No\.\r?\n\r?\n)\d+\.\d+\.\d+',
        $newVersion,
        1
    )
    [System.IO.File]::WriteAllText($creditsPath, $content, [System.Text.UTF8Encoding]::new($false))

    $packageRaw = Get-Content $packagePath -Raw -Encoding UTF8
    $packageRaw = [regex]::Replace(
        $packageRaw,
        '"version"\s*:\s*"\d+\.\d+\.\d+"',
        "`"version`": `"$newVersion`"",
        1
    )
    [System.IO.File]::WriteAllText($packagePath, $packageRaw, [System.Text.UTF8Encoding]::new($false))

    Write-Host "Version bumped to $newVersion"
    return $newVersion
}

$version = Update-BackupVersion

git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to backup."
    exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMsg = if ($version) { "backup: $timestamp (v$version)" } else { "backup: $timestamp" }
git commit -m $commitMsg
git push origin main
Write-Host "Backup pushed at $timestamp"
