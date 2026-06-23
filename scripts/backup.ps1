# Backup script — commits and pushes if there are changes.
# Usage: .\scripts\backup.ps1
# Schedule via Windows Task Scheduler for regular GitHub backups.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to backup."
    exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "backup: $timestamp"
git push origin main
Write-Host "Backup pushed at $timestamp"
