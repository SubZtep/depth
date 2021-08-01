<template lang="pug">
Help
component(:is="page")

teleport(to="#hud")
  CameraInput
</template>

<script lang="ts" setup>
import { useActiveRouteComponent } from "../../packages/router/plugin"

const page = useActiveRouteComponent()
</script>
