<template lang="pug">
Help
component(:is="page")
//- component(:is="page" v-bind="toComp")

//-teleport(to="#hud")
  HudVideo(@on-ref="handleVideoRef")
</template>

<script lang="ts" setup>
import { useGui } from "~/packages/datGUI"
import { useActiveRouteComponent } from "../../packages/router/plugin"

const page = useActiveRouteComponent()
const toComp = { video: ref(null) }

const handleVideoRef = (video: Ref<HTMLVideoElement>) => {
  set(toComp.video, get(video))
}

useGui().show()
</script>
