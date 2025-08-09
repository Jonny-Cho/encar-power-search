#!/bin/bash

# Chrome Extension 배포용 ZIP 파일 생성
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
ZIP_NAME="encar-power-search-v${VERSION}.zip"

echo "📦 Building Chrome Extension v${VERSION}..."

# 기존 ZIP 파일 아카이빙 (덮어쓰지 않고 누적)
if ls *.zip 1> /dev/null 2>&1; then
    mkdir -p archive
    for file in *.zip; do
        if [ ! -f "archive/$file" ]; then
            mv "$file" archive/
            echo "📁 Moved $file to archive/"
        else
            rm "$file"
            echo "🗑️  Removed duplicate $file"
        fi
    done
fi

# 배포용 ZIP 파일 생성 (개발 파일 제외)
zip -r "$ZIP_NAME" . \
  -x "*.git*" \
  -x "*.md" \
  -x "build.sh" \
  -x "node_modules/*" \
  -x "*.log" \
  -x ".DS_Store" \
  -x "archive/*" \
  -x ".claude/*" \
  -x ".cursor/*" \
  -x ".vscode/*" \
  -x ".github/*" \
  -x "test/*" \
  -x ".idea/*" \
  -x "emoji-icon-generator.html" \
  -x "screenshot.png"

echo "✅ Created: $ZIP_NAME"
echo "🚀 Ready for Chrome Web Store upload!"