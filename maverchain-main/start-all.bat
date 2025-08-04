@echo off
echo Starting MaverChain Development Environment...
echo.

echo Starting Hardhat Node...
start "Hardhat Node" cmd /k "cd /d %~dp0 && npx hardhat node"

echo Waiting 5 seconds for Hardhat to start...
timeout /t 5 /nobreak > nul

echo Starting React App...
start "React App" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both services are starting...
echo Hardhat Node: http://localhost:8545
echo React App: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul 