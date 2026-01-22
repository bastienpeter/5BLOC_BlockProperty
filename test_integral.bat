@echo on
REM =========================================================
REM SCRIPT DE TEST INTEGRAL - BLOCKPROPERTY
REM =========================================================

REM 1. Nettoyage et Compilation des Contrats
call npx hardhat clean
call npx hardhat compile

REM 2. Execution de la suite de tests complete
REM L'option REPORT_GAS=true force l'affichage du cout en Gas (Info Technique)
set REPORT_GAS=true
call npx hardhat test

REM Fin du script
echo =========================================================
echo TEST TERMINE - VERIFIEZ LES LOGS CI-DESSUS
echo =========================================================
pause
