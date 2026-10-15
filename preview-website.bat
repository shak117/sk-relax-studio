@echo off
title SK Relax Beauty Academy & Salon - Production Preview
color 0F

echo ======================================================================
echo    SK RELAX BEAUTY ACADEMY ^& SALON, SATARA — PREVIEWING PRODUCTION BUILD
echo ======================================================================
echo.
echo Building and starting production preview server...
echo The site will automatically open in your browser at:
echo.
echo        http://localhost:3000
echo.
echo Press Ctrl+C in this window when you want to stop the server.
echo ======================================================================
echo.

npm run build && npm run preview
pause
