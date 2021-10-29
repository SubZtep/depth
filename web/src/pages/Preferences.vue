<template lang="pug">
Title Preferences (ambient light)

component(:is="activeObject")
</template>

<script lang="ts" setup>
import { useThreeJSEventHook } from "@depth/three.js"
import { addGuiFolder } from "@depth/dat.gui"
import { useAssets, exec3D, setupBoundaries } from "@depth/three.js"
import { usePreferencesStore } from "../stores/preferences"
import { keypointFactory } from "../3D/factories"
import GlobalAmbientLight from "../components/preferences/GlobalAmbientLight.vue"
import GlobalDirectionalLight from "../components/preferences/GlobalDirectionalLight.vue"

onMounted(() => threeJs.trigger({ cmd: "RenderFrames", param: "All" }))

const preferences = usePreferencesStore()
const guiScaleCss = useCssVar("--gui-scale")
const { loadSkybox } = useAssets()
const threeJs = useThreeJSEventHook()

const ball = keypointFactory({ color: "red" })
ball.position.set(0, 1.6, 0)
ball.scale.set(15, 15, 15)
exec3D(({ scene }) => scene.add(ball))

const { folder: fPref } = addGuiFolder(folder => {
  folder.name = "⚙ Preferences"
  folder
    .add(preferences, "guiScale", 0.5, 3, 0.1)
    .name("GUI scale")
    .onFinishChange(scale => set(guiScaleCss, String(scale)))
  folder
    .add(preferences, "skybox", 1, 15, 1)
    .name("Skybox")
    .onChange(async nr => {
      const bg = await loadSkybox(nr)
      exec3D(({ scene }) => {
        scene.background = bg
      })
    })
  folder
    .add(preferences, "horizontalLock")
    .name("Rotation lock")
    .onChange((lock: boolean) => {
      exec3D(({ cameraControls }) => {
        setupBoundaries(cameraControls, lock ? "Full" : "Simple")
      })
    })
})

const emptyValue = "--- ??? ---"
const editables = { [emptyValue]: null, "Ambient light": GlobalAmbientLight, "Directional light": GlobalDirectionalLight }
const activeObject = shallowRef(null)

addGuiFolder(folder => {
  folder.domElement.classList.add("opacity-60")
  folder.name = "★ Active object"
  folder.add({ Select: emptyValue }, "Select", Object.keys(editables)).onChange(key => {
    fPref[key === emptyValue ? "open" : "close"]()
    set(activeObject, editables[key])
  })
})

onBeforeUnmount(() => {
  exec3D(({ scene }) => {
    scene.remove(ball)
    ball.dispatchEvent({ type: "dispose" })
    // XXX: in case of misterious memory leak: renderer.renderLists.dispose()
  })
  threeJs.trigger({ cmd: "RenderFrames", param: "CameraMove" })
})
</script>
