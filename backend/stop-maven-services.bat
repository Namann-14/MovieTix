@echo off
echo 🛑 MovieTix - Stopping Maven Services
echo =====================================
echo.

echo Stopping all Java/Maven processes...

:: Kill all Maven processes
taskkill /f /im "java.exe" 2>nul
taskkill /f /im "mvn.exe" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Eureka Server" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Config Server" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq User Service" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Movie Service" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Theater Service" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Showtime Service" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq Booking Service" 2>nul
taskkill /f /im "cmd.exe" /fi "WINDOWTITLE eq API Gateway" 2>nul

echo.
echo ✅ All services stopped!
echo.
echo 💡 Note: You may need to manually close any remaining command windows.
echo.
pause