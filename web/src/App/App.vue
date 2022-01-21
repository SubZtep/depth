<template lang="pug">
Suspense
  template(#default)
    template
      ThreeCanvas
      Teleport(v-if="edit" to="#editor > #playback")
        EditorPlayback
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
import ThreeCanvas from "~/App/ThreeCanvas.vue"
import LoadingScreen from "~/App/LoadingScreen.vue"
import { provide, onMounted } from "vue"

// temporary global edit switch
const edit = ref(false)
provide("edit", edit)

onMounted(() => {
  edit.value = true
})

document.querySelector(".dg.main.depth > .close-button")?.addEventListener("click", () => {
  edit.value = !edit.value
})
</script>
