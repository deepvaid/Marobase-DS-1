#!/bin/bash
# Maropost Design System — Setup Verification Script
# Run: bash scripts/verify-setup.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
PASS=0
FAIL=0

check() {
  if [ -f "$1" ]; then
    echo -e "  ${GREEN}✓${NC} $1"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}✗${NC} $1 — MISSING"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══════════════════════════════════════════"
echo " Maropost Design System — Verification"
echo "═══════════════════════════════════════════"
echo ""

echo "▸ Agent Files"
check "CLAUDE.md"
check ".cursorrules"
check "CLAUDE_CODE_PROMPT.md"

echo ""
echo "▸ Documentation"
check "docs/design-system.md"
check "docs/development.md"
check "docs/deployment.md"
check "docs/figma-integration.md"

echo ""
echo "▸ Personas"
check "docs/personas/store-owner.md"
check "docs/personas/marketing-manager.md"
check "docs/personas/support-agent.md"
check "docs/personas/admin.md"

echo ""
echo "▸ Design Tokens"
check "src/design-tokens/tokens.json"
check "src/design-tokens/build.mjs"
check "src/design-tokens/generated/_variables.scss"
check "src/design-tokens/generated/variables.css"
check "src/design-tokens/generated/tokens.ts"

echo ""
echo "▸ Storybook Config"
check ".storybook/main.ts"
check ".storybook/preview.ts"
check ".storybook/theme.ts"

echo ""
echo "▸ Component Stories"
check "src/components/MpPageHeader.stories.ts"
check "src/components/MpKpiCard.stories.ts"
check "src/components/MpStatusChip.stories.ts"
check "src/components/MpDataTableToolbar.stories.ts"
check "src/components/MpEmptyState.stories.ts"
check "src/components/MpFilterTabs.stories.ts"
check "src/components/MpFloatingBulkBar.stories.ts"
check "src/components/MpFormDrawer.stories.ts"
check "src/components/MpSectionHeader.stories.ts"
check "src/components/layout/AppBar.stories.ts"
check "src/components/layout/AppSidebar.stories.ts"

echo ""
echo "▸ Deploy Config"
check "vercel.json"
check ".gitignore"

echo ""
echo "▸ Token Generation Test"
if node src/design-tokens/build.mjs 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} tokens:build runs successfully"
  PASS=$((PASS + 1))
else
  echo -e "  ${RED}✗${NC} tokens:build failed"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "═══════════════════════════════════════════"
echo -e " Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}"
echo "═══════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
  exit 1
fi
