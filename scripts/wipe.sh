#!/bin/bash

echo "Delete all generated files..."

basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
cd "$basedir"/..

pnpm -r --reverse exec -- rm -rf node_modules/ dist/ .wireit/ .eslintcache pnpm-lock.yaml .pnpm-debug.log tsconfig.tsbuildinfo
rm -rf node_modules/ dist/ .wireit/ .eslintcache pnpm-lock.yaml .pnpm-debug.log tsconfig.tsbuildinfo
