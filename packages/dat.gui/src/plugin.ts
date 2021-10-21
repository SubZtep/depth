import { inject, onBeforeUnmount, onMounted, Plugin } from "vue"
import dat from "dat.gui"
import { addReactiveSelect, addTextInput, addVector3 } from "./extend"
import "./style.css"
// import type { GuiOptions } from "./types"

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
    dat.GUI.prototype.addVector3 = addVector3
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

export function addGuiFolder(init: FolderInit): any {
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
