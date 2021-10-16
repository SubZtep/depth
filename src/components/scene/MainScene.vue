<template lang="pug">
Help

router-view(v-slot="{ Component }")
  transition(name="fade")
    component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "~/packages/datGUI"

useGui().show()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>