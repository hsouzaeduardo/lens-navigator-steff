# PowerShell script for Windows users
Write-Host "🚀 Setting up Deep Research Integration for Lens Navigator" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# Check if .env file exists
if (!(Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file already exists" -ForegroundColor Yellow
}

# Check if OpenAI API key is set
$envContent = Get-Content .env
if (!($envContent | Select-String "VITE_OPENAI_API_KEY=sk-")) {
    Write-Host ""
    Write-Host "⚠️  OpenAI API key not found in .env file" -ForegroundColor Yellow
    Write-Host "Please add your OpenAI API key to the .env file:" -ForegroundColor Yellow
    Write-Host "VITE_OPENAI_API_KEY=sk-your-api-key-here" -ForegroundColor Cyan
    Write-Host ""
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Check for Supabase CLI
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    Write-Host ""
    Write-Host "Deploying Supabase webhook function..." -ForegroundColor Yellow
    supabase functions deploy openai-webhook
} else {
    Write-Host ""
    Write-Host "⚠️  Supabase CLI not found. Skip deploying webhook function." -ForegroundColor Yellow
    Write-Host "Install with: npm install -g supabase" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your OpenAI API key to .env file" -ForegroundColor White
Write-Host "2. Configure webhook in OpenAI dashboard (optional)" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the application" -ForegroundColor White
Write-Host "4. Read DEEP_RESEARCH_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host ""
Write-Host "Important: Make sure you have access to o3-deep-research model" -ForegroundColor Yellow
Write-Host "Contact OpenAI sales if you need access: https://openai.com/contact-sales" -ForegroundColor Cyan
