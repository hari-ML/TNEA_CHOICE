Write-Host "Installing Node.js LTS via winget..."
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

Write-Host "Refreshing environment variables..."
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Installing project dependencies..."
npm install

Write-Host "Starting Next.js development server..."
npm run dev
