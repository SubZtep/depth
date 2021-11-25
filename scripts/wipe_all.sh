#!/bin/bash

cd `dirname "$BASH_SOURCE"`/..

printf "%s\n\n" "Delete all generated files"

pnpm wipe

# Recursive, Only if exists
rm -rf .pnpm-debug.log pnpm-lock.yaml web/src/types/auto-import.d.ts web/src/types/components.d.ts web/public/libs/*/
