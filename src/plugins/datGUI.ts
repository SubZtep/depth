import type { Plugin, Ref } from "vue"
import dat from "dat.gui"
import { watch } from "vue"
import { createEventHook, useCssVar, useFullscreen, set } from "@vueuse/core"

function updateDropdown(targetCtrl: dat.GUIController, list: Record<string, string>, selected: string) {
  let html = `<option value=""></option>`
  html += Object.entries(list).map(([key, val]) => `<option value="${val}"${val === selected && " selected"}>${key}</option>`)
  targetCtrl.domElement.children[0].innerHTML = html
  if (!html.includes(" selected")) targetCtrl.setValue("")
}

dat.GUI.prototype.addReactiveSelect = function (target: Object, propName: string, options: Ref<Record<string, string>>) {
  const ctrl = this.add(target, propName, options.value)
  watch(options, newList => updateDropdown(ctrl, newList, target[propName]))
  return ctrl
}

const gui = new dat.GUI({ closed: false, width: 380 })
// gui.remember({})

function addPreferences(gui: dat.GUI) {
  const { toggle } = useFullscreen()
  const pref = {
    guiScale: 1.2,
    toggle,
  }
  const guiScaleCss = useCssVar("--gui-scale")
  set(guiScaleCss, String(pref.guiScale))
  const f = gui.addFolder("Preferences")
  f.add(pref, "guiScale", 0.5, 3.5, 0.1).onFinishChange(scale => set(guiScaleCss, String(scale))).name("GUI Scale Size")
  f.add(pref, "toggle").name("Toggle Fullscreen")
}

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Camera>()
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  const f = gui.addFolder("InGame Camera Control")
  f.add(btns, "rotate").name("Rotate")
  f.add(btns, "shake").name("Shake")
  f.close()
  return hook
}

export default {
  install(app) {
    app.provide("gui", gui)
    app.provide("cameraHook", addCameraControl(gui))
    app.provide("preferencesHook", addPreferences(gui))
  },
} as Plugin
