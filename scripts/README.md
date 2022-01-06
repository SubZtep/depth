# Project related shell scripts

Set execution attribute on bash files is conventionality.

## Clone, install and execute, as dev

### `./mediapipe_public.sh`

Copy solution files for the local public folder, only request them in production mode.

### `./threejs_public.sh`

Copy Three.js libraries to the public folder.

## Helper

### `./wipe_all.sh`

Delete all the generated files but `web/public/libs/*/`. Those files rarely change (results of the copy scripts above).
