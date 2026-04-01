# GitHub Enterprise AI Setup Script
# Run this in PowerShell to configure GitHub Enterprise with AI features

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "GitHub Enterprise AI Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install GitHub Copilot CLI extension
Write-Host "Step 1: Installing GitHub Copilot CLI extension..." -ForegroundColor Yellow
gh extension install github/gh-copilot
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Copilot extension installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Copilot extension (may already be installed)" -ForegroundColor Red
}

# Step 2: Check current auth status
Write-Host ""
Write-Host "Step 2: Checking current authentication..." -ForegroundColor Yellow
gh auth status

# Step 3: Prompt for Enterprise hostname
Write-Host ""
Write-Host "Step 3: GitHub Enterprise Server Setup" -ForegroundColor Yellow
Write-Host "Enter your GitHub Enterprise Server hostname (e.g., github.yourcompany.com):" -ForegroundColor Cyan
$hostname = Read-Host

if ($hostname) {
    Write-Host ""
    Write-Host "Authenticating with $hostname..." -ForegroundColor Yellow
    gh auth login --hostname $hostname
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully authenticated with $hostname" -ForegroundColor Green
        
        # Set as default host
        Write-Host ""
        Write-Host "Setting $hostname as default..." -ForegroundColor Yellow
        gh auth switch --hostname $hostname
    } else {
        Write-Host "✗ Authentication failed" -ForegroundColor Red
    }
}

# Step 4: Verify Copilot is accessible
Write-Host ""
Write-Host "Step 4: Verifying Copilot access..." -ForegroundColor Yellow
gh copilot --help

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now use:" -ForegroundColor Cyan
Write-Host "  gh copilot suggest 'your question'  - Get AI suggestions" -ForegroundColor White
Write-Host "  gh copilot explain 'command'        - Explain shell commands" -ForegroundColor White
Write-Host "  gh copilot auth status              - Check Copilot auth" -ForegroundColor White
Write-Host ""
Write-Host "For IDE integration (VS Code):" -ForegroundColor Cyan
Write-Host "  1. Install GitHub Copilot extension" -ForegroundColor White
Write-Host "  2. Sign in with your Enterprise account" -ForegroundColor White
Write-Host "  3. Configure Copilot settings in VS Code" -ForegroundColor White
Write-Host ""
