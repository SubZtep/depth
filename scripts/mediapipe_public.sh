#!/bin/bash

printf "%s\n\n" "Make Mediapipe public for local development"

cd `dirname "$BASH_SOURCE"`/..

# Recursive, Update, Verbose
cp -ruv packages/poser/node_modules/@mediapipe/*/ web/public/libs/
