#!/usr/bin/env bash
# Aisoldier — scaffold a new project from the template.
# Usage: ./scripts/new-project.sh <project-name>

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/projects/_template"
DEST="$ROOT/projects/$PROJECT_NAME"
DATE="$(date +%Y-%m-%d)"

if [ -d "$DEST" ]; then
  echo "Project already exists: $DEST"
  exit 1
fi

if [ ! -d "$TEMPLATE" ]; then
  echo "Template missing: $TEMPLATE"
  exit 1
fi

cp -R "$TEMPLATE" "$DEST"

find "$DEST" -type f -name "*.md" -print0 | while IFS= read -r -d '' file; do
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$file"
    sed -i '' "s/{{YYYY-MM-DD}}/$DATE/g" "$file"
  else
    sed -i "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$file"
    sed -i "s/{{YYYY-MM-DD}}/$DATE/g" "$file"
  fi
done

echo "Created $DEST"
echo ""
echo "Next: cd ~/Aisoldier && claude"
echo "Then ask 3mpq-soldier to run kickoff research for '$PROJECT_NAME'."
