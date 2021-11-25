#!/bin/bash

printf "%s\n\n" "Make Draco public"

cd `dirname "$BASH_SOURCE"`/..

# Recursive, Update, Verbose
cp -ruv packages/three.js/node_modules/three/examples/js/libs/draco/ web/public/libs/draco
