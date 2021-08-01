<template lang="pug">
Help
component(:is="page" v-bind="toComp")

teleport(to="#hud")
  VideoDisplay(@on-ref="v => set(toComp.video, get(v))")
</template>

<script lang="ts" setup>
import { get, set } from "@vueuse/core"
import { useActiveRouteComponent } from "../../packages/router/plugin"

const page = useActiveRouteComponent()
const toComp = { video: ref(null) }
</script>
