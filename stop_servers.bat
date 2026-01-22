@echo off
echo Stopping BlockProperty Servers...
echo.
echo [WARNING] This will force close ALL Node.js processes on your computer.
echo If you have other Node projects running, please close the specific windows manually instead.
echo.
set /P c=Are you sure you want to kill ALL Node.js processes? (Y/N): 
if /I "%c%" EQU "Y" goto :kill
goto :eof

:kill
taskkill /F /IM node.exe
echo.
echo All Node processes terminated.
pause
