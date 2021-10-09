import type { Plugin } from "vue"
import dat from "dat.gui"
import { addReactiveSelect, addTextInput } from "./extend"
import "./style.css"

type FolderInit = (folder: dat.GUI) => void
const guiKey = Symbol("dat.gui")

const plugin: Plugin = {
  install(app, options?: GuiOptions) {
    const gui = new dat.GUI({ autoPlace: false, width: 285, closeOnTop: false })
    gui.domElement.classList.add("depth")
    document.body.appendChild(gui.domElement)
    app.provide(guiKey, gui)
    options?.addons?.reverse().forEach(addon => addon.call(null, gui))

    dat.GUI.prototype.addReactiveSelect = addReactiveSelect
    dat.GUI.prototype.addTextInput = addTextInput
  },
}

export default plugin

export function useGui(options?: { close?: boolean }) {
  const gui = inject<dat.GUI>(guiKey)!
  if (options?.close !== undefined) {
    gui[options.close ? "close" : "open"]()
  }
  return gui
}

let cx = 0

export function useGuiFolder(init: FolderInit): any {
  const gui = inject<dat.GUI>(guiKey)!
  const folderName = `f${++cx}`
  const folder = gui.addFolder(folderName)

  onMounted(() => {
    folder.open()
    init(folder)
  })

  onBeforeUnmount(() => {
    gui.removeFolder(folder)
    delete gui.__folders[folderName]
    cx--
  })
}
