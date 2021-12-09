#!/bin/bash

printf "%s\n\n" "Make Draco public"

cd `dirname "$BASH_SOURCE"`/..
cp -ruv packages/canvas/node_modules/three/examples/js/libs/draco/ web/public/libs/draco
