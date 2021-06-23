import * as dat from "dat.gui"
import type { Plugin } from "vue"
import { watch } from "vue"
import { createEventHook, useCssVar, useFullscreen, useDocumentVisibility, get, set } from "@vueuse/core"
import { useGlobalState } from "../store"

const gui = new dat.GUI()
const state = useGlobalState()
const visibility = useDocumentVisibility()

watch(visibility, (current, previous) => {
  if (current === "hidden" && previous === "visible") {
    console.log("SAVE STUFF", gui.__folders)
  }
})

function addOptions(gui: dat.GUI) {
  const hook = createEventHook<GUIEventold.Options>()
  const guiScale = useCssVar("--gui-scale")
  const { toggle } = useFullscreen()
  set(guiScale, "1.5")
  const opts = {
    guiScale: 1.5,
    skybox: 14,
    toggle,
  }

  const f = gui.addFolder("⚙various options")

  f.add(opts, "guiScale", 0.5, 3.5, 0.1)
    .onFinishChange(scale => set(guiScale, String(scale)))
    .name("🦠this gui scale")

  f.add(opts, "skybox", 1, 15, 1)
    .onFinishChange(skybox => hook.trigger({ skybox }))
    .name("🌃sky time")

  f.add(opts, "toggle").name("✯ fullscreen")
  return hook
}

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEventold.Camera>()
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  const f = gui.addFolder("🎥ingame camera control")
  f.add(btns, "rotate").name("✯ rotate")
  f.add(btns, "shake").name("✯ shake")
  f.add(get(state), "cameraZoomToPile").name("✯ zoom to pile")
  return hook
}

export default {
  install(app) {
    app.provide("gui", gui)
    app.provide("cameraHook", addCameraControl(gui))
    app.provide("optionsHook", addOptions(gui))
  },
} as Plugin
