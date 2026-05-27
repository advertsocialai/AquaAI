#!/bin/bash
# PreToolUse Bash hook: deny a small set of destructive commands by default.
# Override: run via shell (! prefix) or remove the hook from .claude/settings.local.json.

cmd=$(jq -r '.tool_input.command // ""')
deny=""

# rm -rf / rm -fr / rm -r -f (any order of -r -f flags combined)
if printf '%s' "$cmd" | grep -qE '(^|[[:space:]])rm[[:space:]]+(-[rRfF]{1,3}([[:space:]]|$)|-rf|-fr|-Rf|-fR)'; then
  deny="rm -rf (recursive force-delete)"
fi

# git push --force / -f, but allow --force-with-lease
if [ -z "$deny" ] && printf '%s' "$cmd" | grep -qE 'git[[:space:]]+push.*(--force([[:space:]]|=|$)|[[:space:]]-f([[:space:]]|$))'; then
  if ! printf '%s' "$cmd" | grep -q "force-with-lease"; then
    deny="git push --force (use --force-with-lease instead)"
  fi
fi

# git reset --hard
if [ -z "$deny" ] && printf '%s' "$cmd" | grep -qE 'git[[:space:]]+reset[[:space:]]+--hard'; then
  deny="git reset --hard (destroys uncommitted changes)"
fi

if [ -n "$deny" ]; then
  jq -nc --arg r "Blocked: $deny. To override, run via shell (! prefix) or edit .claude/settings.local.json hooks." \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
fi
exit 0
