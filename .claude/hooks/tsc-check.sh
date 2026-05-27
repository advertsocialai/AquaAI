#!/bin/bash
# PostToolUse Write|Edit hook: run project tsc --noEmit if a src/**/*.ts(x) file was edited.
# Runs async (asyncRewake) so the model isn't blocked. Exit 2 surfaces errors back to Claude.

cd "$(dirname "$0")/../.." || exit 0
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // ""')
case "$f" in
  */src/*.ts|*/src/*.tsx) ;;
  *) exit 0 ;;
esac

out=$(npx --no-install tsc --noEmit -p tsconfig.app.json 2>&1)
if [ $? -ne 0 ]; then
  printf 'TypeScript errors detected after editing %s:\n\n%s\n' "$f" "$out"
  exit 2
fi
exit 0
