# Fail fast if anything goes wrong
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Starting Resume AI backend API..."
Write-Host ""

# Always run from this folder, even if script is called elsewhere
Set-Location $PSScriptRoot

$venvPath = ".venv"
$pythonExe = "python"

# Create virtual environment if it does not exist
if (!(Test-Path $venvPath)) {
    Write-Host "Virtual environment not found. Creating one..."
    & $pythonExe -m venv $venvPath
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
& "$venvPath\Scripts\Activate.ps1"

# Install backend dependencies (safe to run multiple times)
Write-Host "Installing backend dependencies..."
pip install fastapi uvicorn

# Run FastAPI dev server with auto-reload
Write-Host ""
Write-Host "Backend running at http://127.0.0.1:8000"
Write-Host "Swagger UI available at http://127.0.0.1:8000/docs"
Write-Host ""

uvicorn resume_ai_api.main:app --reload --app-dir src
