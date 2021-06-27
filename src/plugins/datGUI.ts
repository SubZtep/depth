import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { watch } from "vue"
import { createEventHook, useCssVar, useFullscreen, useDocumentVisibility, get, set } from "@vueuse/core"
import { useGlobalState } from "../store"

const gui = new dat.GUI()
gui.remember({})
const state = useGlobalState()
const visibility = useDocumentVisibility()

watch(visibility, (current, previous) => {
  if (current === "hidden" && previous === "visible") {
    console.log("bye for now", gui.__folders)
  }
})

function addPreferences(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Preferences>()
  const { toggle } = useFullscreen()
  const opts = {
    guiScale: 1.5,
    skybox: 14,
    toggle,
  }
  const guiScaleCss = useCssVar("--gui-scale")
  set(guiScaleCss, String(opts.guiScale))

  const f = gui.addFolder("Preferences")

  f.add(opts, "guiScale", 0.5, 3.5, 0.1)
    .onFinishChange(scale => set(guiScaleCss, String(scale)))
    .name("GUI Scale Size")

  f.add(opts, "skybox", 1, 15, 1)
    .onFinishChange(skybox => hook.trigger({ skybox }))
    .name("Sky Time")

  f.add(opts, "toggle").name("Toggle Fullscreen")
  return hook
}

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Camera>()
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
    app.provide("preferencesHook", addPreferences(gui))
  },
} as Plugin
