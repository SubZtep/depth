<template lang="pug">
  //- h3 pose {{ pose }}
  h3 right_eye {{body.get("right_eye")}} - {{body.get("right_eye")?.x}}
  Renderer(antialias resize)
    //- Camera(:position="{ z: 3 }" :lookAt="body.get('right_eye')")
    Camera(:position="{ y: 1, z: 50 }")
    Scene(background="red")
      PointLight
        Box(:position="body.get('right_eye')" :rotation="{x: 90, y: 60, z: 90 }")
          ToonMaterial(color="blue")
  </template>

  <script lang="ts" setup>
  import { useBody } from "../composables/useBody"
  import { usePoser } from "../composables/usePoser"
  const { pose, width, height } = usePoser()
  const { body } = useBody(pose, width, height)

  // body.value.
  </script>

  <style>
  /* .wrapper {
    position: relative;
    width: 640px;
    height: 480px;
    transform: scale(-1, 1);
  }

  .pose {
    position: absolute;
    top: 0;
    width: inherit;
    height: inherit;
  } */
  </style>
