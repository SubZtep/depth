import type { Plugin } from "vue"
import dat from "dat.gui"
import "./extend"
import "./style.css"

type FolderInit = (folder: dat.GUI) => void

const gui = new dat.GUI({
  autoPlace: false,
  width: 250,
  closeOnTop: false,
})

document.body.appendChild(gui.domElement)
const guiKey = Symbol("dat.gui")

const plugin: Plugin = {
  install(app, options?: GuiOptions) {
    app.provide(guiKey, gui)

    options?.addons?.reverse().forEach(addon => addon.call(null, gui))
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

let cx = 0

export function useGuiFolder(init: FolderInit) {
  const g = inject<dat.GUI>(guiKey)!
  const folderName = `f${++cx}`
  let folder: dat.GUI
  try {
    folder = g.addFolder(folderName)
  } catch (e) {
    console.error("Add GUI folder", e)
  }

  onMounted(() => {
    folder.open()
    init(folder)
  })

  onBeforeUnmount(() => {
    gui.removeFolder(folder)
    delete g.__folders[folderName]
    cx--
  })
}
