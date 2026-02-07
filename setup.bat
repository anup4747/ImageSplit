@echo off
REM Image Splitter - Complete Setup Script (Windows)
REM This script installs all dependencies and verifies setup

setlocal enabledelayedexpansion

echo.
echo 🚀 Image Splitter - Complete Setup
echo ====================================
echo.

REM Check Node.js version
echo 📦 Checking Node.js version...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo    Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo 📥 Installing dependencies ^(this may take a few minutes^)...
call npm install
if errorlevel 1 (
    echo    ❌ Failed to install dependencies
    exit /b 1
)
echo    ✅ Dependencies installed
echo.

REM Run linter
echo 🔍 Running ESLint check...
call npm run lint
if errorlevel 1 (
    echo    ⚠️  ESLint found issues ^(run 'npm run lint' to see details^)
) else (
    echo    ✅ ESLint check passed
)
echo.

REM Run tests
echo 🧪 Running tests...
call npm test -- --passWithNoTests
if errorlevel 1 (
    echo    ⚠️  Some tests failed ^(run 'npm test' for details^)
) else (
    echo    ✅ Tests passed
)
echo.

REM Build check
echo 🏗️  Building application...
call npm run build
if errorlevel 1 (
    echo    ❌ Build failed
    exit /b 1
)
echo    ✅ Build successful
echo.

echo ✨ Setup complete!
echo.
echo Next steps:
echo   npm run dev              # Start development server
echo   npm test -- --watch      # Run tests in watch mode
echo   npm run lint -- --fix    # Auto-fix ESLint issues
echo.
echo Documentation:
echo   - COMPLETION_SUMMARY.md  # Overview of all enhancements
echo   - ENHANCEMENTS.md        # Detailed enhancement guide
echo   - INTEGRATION_GUIDE.md   # How everything works together
echo.
echo Happy coding! 🎨
echo.

pause
