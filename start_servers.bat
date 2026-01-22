@echo off
echo Demarrage de l'environnement BlockProperty...
echo 1. Demarrage du noeud Blockchain...
start "BlockProperty: Blockchain (NE PAS FERMER)" cmd /k "npx hardhat node"

echo Attente de l'initialisation de la blockchain...
timeout /t 5 /nobreak >nul

echo 2. Deploiement des contrats...
call npx hardhat run scripts/deploy.ts --network localhost

echo 3. Demarrage du Frontend...
cd frontend
start "BlockProperty: DApp (NE PAS FERMER)" cmd /k "npm run dev"

echo.
echo ========================================
echo   Les serveurs sont en ligne !
echo   - Blockchain: Fenetre "BlockProperty: Blockchain"
echo   - Frontend:   Fenetre "BlockProperty: DApp"
echo ========================================
echo.
echo Utilisez stop_servers.bat pour tout fermer.
pause
