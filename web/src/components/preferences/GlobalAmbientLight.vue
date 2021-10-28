<template lang="pug">
Title Ambient light
</template>

<script lang="ts" setup>
import { AmbientLight } from "three"
import { addGuiFolder, ColorGUIHelper } from "@depth/dat.gui"
import useObjectPool from "../../composables/useObjectPool"

const light = useObjectPool().pop("GlobalAmbientLight") as AmbientLight

addGuiFolder(folder => {
  folder.name = "💡 Ambient light"
  folder.addColor(new ColorGUIHelper(light, "color"), "value").name("Color")
  folder.add(light, "intensity", 0, 2, 0.01).name("Intensity")
})
</script>
