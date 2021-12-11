#!/bin/bash

gltf-pipeline -i web/public/models/origin/snail_shell_photogrammetry/scene_webp.gltf -o web/public/models/SnailShell.glb -d --stats


# 1. Resize textures (with Gimp).

# 2. Convert to WebP \
#    https://developers.google.com/speed/webp/docs/using

# 3. https://github.com/CesiumGS/gltf-pipeline \
#    `$ gltf-pipeline -i scene.gltf -o scene.glb -t -d`
