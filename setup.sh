#!/usr/bin/env bash

# Image Splitter - Complete Setup Script
# This script installs all dependencies and verifies setup

set -e

echo "🚀 Image Splitter - Complete Setup"
echo "===================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node.js version: $NODE_VERSION"
echo ""

# Install dependencies
echo "📥 Installing dependencies (this may take a few minutes)..."
npm install
echo "   ✅ Dependencies installed"
echo ""

# Run linter check
echo "🔍 Running ESLint check..."
npm run lint 2>&1 | grep -c "error" && echo "   ⚠️  ESLint found issues (run 'npm run lint' to see details)" || echo "   ✅ ESLint check passed"
echo ""

# Run tests
echo "🧪 Running tests..."
if npm test -- --passWithNoTests; then
    echo "   ✅ Tests passed"
else
    echo "   ⚠️  Some tests failed (run 'npm test' for details)"
fi
echo ""

# Build check
echo "🏗️  Building application..."
npm run build
echo "   ✅ Build successful"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  npm run dev              # Start development server"
echo "  npm test -- --watch      # Run tests in watch mode"
echo "  npm run lint -- --fix    # Auto-fix ESLint issues"
echo ""
echo "Documentation:"
echo "  - COMPLETION_SUMMARY.md  # Overview of all enhancements"
echo "  - ENHANCEMENTS.md        # Detailed enhancement guide"
echo "  - INTEGRATION_GUIDE.md   # How everything works together"
echo ""
echo "Happy coding! 🎨"
