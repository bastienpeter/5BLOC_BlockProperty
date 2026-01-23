@echo off
REM =========================================================
REM SCRIPT D'INSTALLATION DES DEPENDANCES
REM =========================================================

echo 1. Verification de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Erreur : Node.js n'est pas installe.
    echo Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js est present.

echo.
echo Voulez-vous mettre a jour NPM vers la derniere version ? (Recommande)
set /P c=Mettre a jour NPM ? (O/N) : 
if /I "%c%" EQU "O" (
    echo Mise a jour de NPM...
    call npm install -g npm@latest
)
if /I "%c%" EQU "Y" (
    echo Mise a jour de NPM...
    call npm install -g npm@latest
)

echo.
echo 2. Installation des dependances du projet (Racine)...
call npm install
echo    > Installation specifique de Hardhat (si manquant)...
call npm install --save-dev hardhat

echo 3. Installation des dependances du Frontend...
cd frontend
call npm install
cd ..

echo.
echo =========================================================
echo INSTALLATION TERMINEE
echo Vous pouvez maintenant lancer les scripts de demarrage.
echo =========================================================
pause
