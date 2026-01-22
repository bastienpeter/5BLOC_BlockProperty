@echo off
echo Arret des serveurs BlockProperty...
echo.
echo [ATTENTION] Cela va fermer DE FORCE tous les processus Node.js sur votre ordinateur.
echo Si vous avez d'autres projets Node en cours, fermez plutot les fenetres manuellement.
echo.
set /P c=Etes-vous sur de vouloir tuer TOUS les processus Node.js ? (O/N) : 
if /I "%c%" EQU "O" goto :kill
if /I "%c%" EQU "Y" goto :kill
goto :eof

:kill
taskkill /F /IM node.exe
echo.
echo Tous les processus Node ont ete termines.
pause
