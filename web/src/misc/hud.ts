import { usePreferencesStore } from "../stores/preferences"
// import { useAssets } from "@depth/three.js"
// import { singleFns, singleFnPrs } from "@depth/three.js"
// import { setupBoundaries } from "@depth/three.js"
import type { RouteRecordNormalized } from "vue-router"
import { kebabToTitle } from "../misc/transformers"
import router from "../router"
import { useCssVar, useFullscreen, set } from "@vueuse/core"

export function logLoaded(str: string) {
  console.log(
    `%c ${str} %cloaded%c 𓀼`,
    "background-color: #107c10; color: #ffc83d;",
    "background-color: cyan; color: green;",
    "background-color: transparent;"
  )
}

export function navigationGui(routes: RouteRecordNormalized[]) {
  // return (gui: dat.GUI) => {
  return (gui: any) => {
    const btns = {}
    const f = gui.addFolder("⚓ Navigation")
    routes.forEach(route => {
      const { name } = route as { name: string }
      btns[name] = () => void router.push({ name })
      f.add(btns, name).name(kebabToTitle(name))
    })
  }
}

// export function preferencesGui(gui: dat.GUI) {
export function preferencesGui(gui: any) {
  const preferences = usePreferencesStore()

  const guiScaleCss = useCssVar("--gui-scale")
  // const { loadSkybox } = useAssets()
  const { enter, exit } = useFullscreen()

  const f = gui.addFolder("⚙ Preferences")
  f.add(preferences, "guiScale", 0.5, 3, 0.1)
    .name("GUI scale")
    .onFinishChange(scale => set(guiScaleCss, String(scale)))
  // f.add(preferences, "skybox", 1, 15, 1)
  //   .name("Skybox")
  //   .onChange(nr =>
  //     // singleFnPrs.add(async ({ scene }) => {
  //     //   scene.background = await loadSkybox(nr)
  //     // })
  //   )
  f.add(preferences, "horizontalLock")
    .name("Rotation lock")
    .onChange(lock => {
      // singleFns.add(({ cameraControls }) => {
      //   setupBoundaries(cameraControls, lock)
      // })
    })
  f.add(preferences, "fullscreen")
    .name("Fullscreen")
    .onChange(fs => {
      // TODO: impement reactive gui checkbox
      fs ? enter() : exit()
    })
}
