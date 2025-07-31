#!/bin/bash

# Chrome Extension 배포용 ZIP 파일 생성
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
ZIP_NAME="encar-power-search-v${VERSION}.zip"

echo "📦 Building Chrome Extension v${VERSION}..."

# 기존 ZIP 파일 아카이빙
if [ -f *.zip ]; then
    mkdir -p archive
    mv *.zip archive/
    echo "📁 Previous versions moved to archive/"
fi

# 배포용 ZIP 파일 생성 (개발 파일 제외)
zip -r "$ZIP_NAME" . \
  -x "*.git*" \
  -x "*.md" \
  -x "build.sh" \
  -x "node_modules/*" \
  -x "*.log" \
  -x ".DS_Store"

echo "✅ Created: $ZIP_NAME"
echo "🚀 Ready for Chrome Web Store upload!"