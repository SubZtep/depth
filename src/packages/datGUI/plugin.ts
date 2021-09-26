import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import dat from "dat.gui"
import { inject, computed } from "vue"
import { get, createEventHook, useCssVar, toRefs, syncRef } from "@vueuse/core"
import { useGlobalState } from "../../store"
import "./extend"
import "./style.css"

type FolderInit = (folder: dat.GUI) => void

const state = useGlobalState()
const { guiScale } = toRefs(state)
const guiScaleCss = useCssVar("--gui-scale")
syncRef(
  computed(() => String(get(guiScale))),
  guiScaleCss
)

const guiKey = Symbol("dat.gui")
const cameraHookKey = Symbol("camera hook")

// const gui = new dat.GUI({ autoPlace: false, closed: false, width: 280, closeOnTop: false })
const gui = new dat.GUI({ autoPlace: false, width: 250, closeOnTop: false })
gui.domElement.id = "gui"
document.body.appendChild(gui.domElement)
// gui.domElement.removeAttribute("style")
// document.querySelector("#hud")!.appendChild(gui.domElement)
//gui.hide()

function addCameraControl(gui: dat.GUI, routes?: Route[]) {
  const hook = createEventHook<GUIEvent.Camera>() // TODO: what's this hook for?
  const btns = {
    // rotate: () => hook.trigger({ cmd: "rotate" }),
    // shake: () => hook.trigger({ cmd: "shake" }),
  }

  if (routes) {
    const f = gui.addFolder("⚓ Navigation")
    // f.open()
    // f.domElement.addEventListener("mouseover", () => f.open())
    // f.domElement.addEventListener("mouseout", () => f.close())

    routes.forEach(({ path, label }) => {
      const name = path.substring(1)
      btns[name] = () => {
        window.location.hash = path
        // f.close()
      }
      f.add(btns, name).name(label)
    })
  }

  return hook
}

const plugin: Plugin = {
  install(app, options?: GuiOptions) {
    app.provide(guiKey, gui)
    app.provide(cameraHookKey, addCameraControl(gui, options?.routes))
  },
}

export default plugin

export function useGui(options?: { close?: boolean }) {
  const g = inject<dat.GUI>(guiKey)!
  if (options?.close !== undefined) {
    g[options.close ? "close" : "open"]()
  }
  return g
}

export function useGuiFolder(init?: FolderInit) {
  const g = inject<dat.GUI>(guiKey)!
  const folder = g.addFolder("Page GUI")

  onBeforeUnmount(() => {
    gui.removeFolder(folder)
  })

  init && init(folder)
  folder.open()
}

export function useOnCameraEvent(cb: (params: GUIEvent.Camera) => void) {
  inject<EventHook<GUIEvent.Camera>>(cameraHookKey)!.on(cb)
}
