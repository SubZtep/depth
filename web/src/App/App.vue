<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
import ThreeCanvas from "~/App/ThreeCanvas.vue"
import LoadingScreen from "~/App/LoadingScreen.vue"
</script>
