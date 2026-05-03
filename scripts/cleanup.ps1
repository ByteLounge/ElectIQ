# ElectIQ Repository Cleanup Script
# This script reduces the repository size by:
# 1. Removing node_modules (which can be reinstalled)
# 2. Removing build/dist artifacts
# 3. Purging Git history reflogs and performing aggressive garbage collection

Write-Host "Starting ElectIQ cleanup process..." -ForegroundColor Cyan

# 1. Remove node_modules
Write-Host "`nStep 1: Removing node_modules..." -ForegroundColor Yellow
$node_modules = Get-ChildItem -Path . -Filter "node_modules" -Recurse -Directory
foreach ($dir in $node_modules) {
    Write-Host "Deleting $($dir.FullName)..."
    Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue
}

# 2. Remove build and dist folders
Write-Host "`nStep 2: Removing build and dist folders..." -ForegroundColor Yellow
$artifacts = Get-ChildItem -Path . -Include "dist","build" -Recurse -Directory
foreach ($dir in $artifacts) {
    Write-Host "Deleting $($dir.FullName)..."
    Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. Clean Git history
Write-Host "`nStep 3: Cleaning Git history (this may take a moment)..." -ForegroundColor Yellow
if (Test-Path ".git") {
    # Remove reflogs (history of branch updates)
    git reflog expire --expire=now --all
    
    # Aggressive garbage collection
    # We use -c gc.auto=0 to disable background auto-gc which can cause locks
    git -c gc.auto=0 gc --prune=now --aggressive
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Git GC encountered an issue. This is often due to file locks (e.g., IDE or Antivirus)."
        Write-Host "Attempting a lighter prune..."
        git prune
    }
} else {
    Write-Warning "No .git directory found."
}

# Final Size Report
$totalSize = Get-ChildItem -Recurse | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\.git" } | Measure-Object -Property Length -Sum
$gitSize = Get-ChildItem -Path .git -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum

Write-Host "`n--- Cleanup Complete ---" -ForegroundColor Green
Write-Host "Project files size: $([math]::Round($totalSize.Sum / 1MB, 2)) MB"
Write-Host "Git repository size: $([math]::Round($gitSize.Sum / 1MB, 2)) MB"
Write-Host "Total size: $([math]::Round(($totalSize.Sum + $gitSize.Sum) / 1MB, 2)) MB"

if (($totalSize.Sum + $gitSize.Sum) -gt 10MB) {
    Write-Host "`nWarning: Repository is still over 10MB." -ForegroundColor Red
    Write-Host "This is likely because the Git history contains large objects."
    Write-Host "To further reduce size, you may need to use a tool like 'git filter-repo' or squash history."
} else {
    Write-Host "`nSuccess! Repository size is under 10MB." -ForegroundColor Green
}
