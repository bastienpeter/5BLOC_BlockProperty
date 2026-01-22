@echo off
echo Starting BlockProperty Environment...
echo 1. Starting Blockchain Node...
start "BlockProperty: Blockchain (DO NOT CLOSE)" cmd /k "npx hardhat node"

echo Waiting for blockchain to initialize...
timeout /t 5 /nobreak >nul

echo 2. Deploying Contracts...
call npx hardhat run scripts/deploy.ts --network localhost

echo 3. Starting Frontend...
cd frontend
start "BlockProperty: DApp (DO NOT CLOSE)" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers are running!
echo   - Blockchain: Window "BlockProperty: Blockchain"
echo   - Frontend:   Window "BlockProperty: DApp"
echo ========================================
echo.
echo Use stop_servers.bat to close everything.
pause
