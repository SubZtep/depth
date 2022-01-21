<template lang="pug">
Suspense
  template(#default)
    //- ThreeCanvas
    template
      ThreeCanvas
      Teleport(v-if="edit" to="#editor")
        EditorMain
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
import { EditorMain } from "@depth/editor"
import ThreeCanvas from "~/App/ThreeCanvas.vue"
import LoadingScreen from "~/App/LoadingScreen.vue"
import { provide } from "vue"

// temporary global edit switch
const edit = ref(true)
provide("edit", edit)
document.querySelector(".dg.main.depth > .close-button")?.addEventListener("click", () => {
  edit.value = !edit.value
})
</script>
